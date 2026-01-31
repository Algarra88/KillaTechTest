import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from "../task-form/task-form.component";
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, TaskFormComponent, ConfirmModalComponent]
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  editingTask: Task | null = null;
  errorMessage: string = '';
  deleteConfirmation = {
    isVisible: false,
    taskId: null as number | null
  };
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    console.log('TaskListComponent initialized');
    // Subscribe to tasks$ to get updates whenever tasks change
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          console.log('Tasks updated from BehaviorSubject:', tasks);
        },
        error: (error) => {
          this.errorMessage = 'Error loading tasks';
          console.error('Error:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks(): void {
    this.taskService.reloadTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.errorMessage = '';
        console.log('Tasks loaded:', tasks);
      },
      error: (error) => {
        this.errorMessage = 'Error loading tasks';
        console.error('Error:', error);
      }
    });
  }

  onToggleComplete(task: Task): void {
    this.taskService.toggleTaskStatus(task.id).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error updating task status';
        console.error('Error:', error);
      }
    });
  }

  onEditTask(task: Task): void {
    this.editingTask = { ...task };
  }

  onUpdateTask(taskData: Partial<Task>): void {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, taskData).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.editingTask = null;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Error updating task';
          console.error('Error:', error);
        }
      });
    }
  }

  onCancelEdit(): void {
    this.editingTask = null;
  }

  onDeleteTask(taskId: number): void {
    this.deleteConfirmation.isVisible = true;
    this.deleteConfirmation.taskId = taskId;
  }

  onConfirmDelete(): void {
    if (this.deleteConfirmation.taskId !== null) {
      const taskId = this.deleteConfirmation.taskId;
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
          this.errorMessage = '';
          this.deleteConfirmation.isVisible = false;
          this.deleteConfirmation.taskId = null;
        },
        error: (error) => {
          this.errorMessage = 'Error deleting task';
          console.error('Error:', error);
          this.deleteConfirmation.isVisible = false;
          this.deleteConfirmation.taskId = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.deleteConfirmation.isVisible = false;
    this.deleteConfirmation.taskId = null;
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(task => !task.completed).length;
  }
}
