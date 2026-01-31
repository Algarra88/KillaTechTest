import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  private isLoading = false;

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  // Load all tasks from the backend
  private loadTasks(): void {
    // Avoid multiple simultaneous requests
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    console.log('Loading tasks from:', this.apiUrl);
    
    this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          console.error('Error loading tasks from API:', error);
          return this.handleError(error);
        })
      )
      .subscribe({
        next: (tasks) => {
          console.log('Raw tasks from API:', tasks);
          // Convert API response to Task interface
          const tasksWithDates = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            createdAt: new Date(task.created_at),
            updatedAt: new Date(task.updated_at)
          }));
          this.tasksSubject.next(tasksWithDates);
          this.isLoading = false;
          console.log('Tasks loaded successfully:', tasksWithDates);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error in tasks subscription:', error);
        }
      });
  }

  // Get all tasks as Observable
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  // Reload tasks from backend
  reloadTasks(): Observable<Task[]> {
    return new Observable(observer => {
      this.http.get<any[]>(this.apiUrl)
        .pipe(
          catchError(this.handleError)
        )
        .subscribe({
          next: (tasks) => {
            const tasksWithDates = tasks.map(task => ({
              id: task.id,
              title: task.title,
              description: task.description,
              completed: task.completed,
              createdAt: new Date(task.created_at || task.createdAt),
              updatedAt: new Date(task.updated_at || task.updatedAt)
            }));
            this.tasksSubject.next(tasksWithDates);
            observer.next(tasksWithDates);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
    });
  }

  // Get a task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<any>(`${this.apiUrl}${id}/`)
      .pipe(
        tap(responseTask => {
          // Transform response to Angular format
          const task: Task = {
            id: responseTask.id,
            title: responseTask.title,
            description: responseTask.description,
            completed: responseTask.completed,
            createdAt: new Date(responseTask.created_at || responseTask.createdAt),
            updatedAt: new Date(responseTask.updated_at || responseTask.updatedAt)
          };
          return task;
        }),
        catchError(this.handleError)
      );
  }

  // Create a new task
  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    // Transform to backend format (snake_case)
    const payload = {
      title: taskData.title,
      description: taskData.description,
      completed: taskData.completed
    };
    
    return this.http.post<any>(`${this.apiUrl}`, payload)
      .pipe(
        tap(responseTask => {
          // After creating, reload from backend to maintain correct order
          this.loadTasks();
        }),
        catchError(this.handleError)
      );
  }

  // Update an existing task
  updateTask(id: number, taskData: Partial<Task>): Observable<Task> {
    // Transform to backend format (snake_case)
    const payload: any = {};
    if (taskData.title !== undefined) payload.title = taskData.title;
    if (taskData.description !== undefined) payload.description = taskData.description;
    if (taskData.completed !== undefined) payload.completed = taskData.completed;
    
    return this.http.put<any>(`${this.apiUrl}${id}/`, payload)
      .pipe(
        tap(responseTask => {
          // After updating, reload from backend to maintain correct order
          this.loadTasks();
        }),
        catchError(this.handleError)
      );
  }

  // Partially update a task (PATCH)
  patchTask(id: number, taskData: Partial<Task>): Observable<Task> {
    // Transform to backend format (snake_case)
    const payload: any = {};
    if (taskData.title !== undefined) payload.title = taskData.title;
    if (taskData.description !== undefined) payload.description = taskData.description;
    if (taskData.completed !== undefined) payload.completed = taskData.completed;
    
    return this.http.patch<any>(`${this.apiUrl}${id}/`, payload)
      .pipe(
        tap(responseTask => {
          // After updating, reload from backend to maintain correct order
          this.loadTasks();
        }),
        catchError(this.handleError)
      );
  }

  // Toggle task status (completed/not completed)
  toggleTaskStatus(id: number): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const task = currentTasks.find(t => t.id === id);
    
    if (!task) {
      return throwError(() => new Error(`Task with ID ${id} not found`));
    }

    return this.patchTask(id, { completed: !task.completed });
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`)
      .pipe(
        tap(() => {
          const currentTasks = this.tasksSubject.value;
          const filteredTasks = currentTasks.filter(task => task.id !== id);
          this.tasksSubject.next(filteredTasks);
        }),
        catchError(this.handleError)
      );
  }

  // Centralized error handling (as arrow function to preserve 'this' context)
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';

    console.error('HttpErrorResponse:', error);
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Error body:', error.error);

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = `Connection Error: Could not reach ${this.apiUrl}. Check if backend is running and CORS is configured.`;
      } else if (error.status === 404) {
        errorMessage = `API Not Found (404): ${this.apiUrl}`;
      } else if (error.status === 500) {
        errorMessage = `Server Error (500): ${error.error?.detail || error.message}`;
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.detail || error.message}`;
      }
    }

    console.error('Final error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
}