import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './models/task.model';
import { TaskService } from './services/task.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent]
})
export class AppComponent {
  title = 'Task Manager';
  errorMessage: string = '';

  constructor(private taskService: TaskService) {}

  onCreateTask(taskData: Partial<Task>): void {
    this.errorMessage = '';
    
    this.taskService.addTask({
      title: taskData.title || '',
      description: taskData.description || '',
      completed: taskData.completed || false
    }).subscribe({
      next: (newTask) => {
        console.log('Task created successfully:', newTask);
        // Reload tasks from backend to refresh the list
        this.taskService.reloadTasks().subscribe({
          next: () => {
            console.log('Tasks reloaded');
          },
          error: (error) => {
            console.error('Error reloading tasks:', error);
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error creating task';
        console.error('Error creating task:', error);
      }
    });
  }
}