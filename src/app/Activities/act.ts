import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ActService, Activity, ActivityLog } from '../service/act_serv';

@Component({
  standalone: true,
  selector: 'activities',
  templateUrl: 'act.html',
  styleUrls: ['act.css'],
  imports: [MatTabsModule, CommonModule, MatIconModule, FormsModule]
})
export class act implements OnInit {
  private actService = inject(ActService);
  private cd = inject(ChangeDetectorRef);

  currentType: string | null = null;
  activities: Activity[] = [];
  completedIds = new Set<number>();

  loading = false;
  fetchError = '';
  addError = '';
  editError = '';
  deleteError = '';

  newActivityName = '';
  newActivityDescription = '';
  newActivitySuggested = false;

  editingId: number | null = null;
  editName = '';
  editDescription = '';
  editSuggested = false;

  ngOnInit() {
    this.currentType = null; // default tab
    this.loadActivitiesAndLogs();
  }

  // ------------------ Load activities + logs ------------------
  loadActivitiesAndLogs(type: string | null = null) {
    this.loading = true;
    this.fetchError = '';

    forkJoin({
      activities: this.actService.getAllActivities(type || undefined),
      logs: this.actService.getLogs('today', type || undefined)
    }).subscribe({
      next: ({ activities, logs }) => {
        // Normalize IDs
        this.activities = activities.map(act => ({ ...act, id: Number(act.id) }));

        // Rebuild completed IDs
        this.completedIds.clear();
        logs.forEach(log => {
          if (log.activityId != null) this.completedIds.add(Number(log.activityId));
        });

        this.cd.detectChanges();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        this.fetchError = 'Failed to load activities';
        this.loading = false;
      }
    });
  }

  // ------------------ Tab switching ------------------
  onTabChange(event: any) {
    const tabs = [null, 'EXERCISE', 'HYDRATION', 'YOGA', 'FOOD'];
    this.currentType = tabs[event.index];

    this.newActivityName = '';
    this.newActivityDescription = '';
    this.newActivitySuggested = false;

    this.loadActivitiesAndLogs(this.currentType);
  }

  // ------------------ Toggle checkbox ------------------
  toggleDone(activity: Activity) {
    const activityId = Number(activity.id);
    const isDone = this.completedIds.has(activityId);

    // Optimistic UI
    if (isDone) this.completedIds.delete(activityId);
    else this.completedIds.add(activityId);

    const request$: Observable<any> = isDone
      ? this.actService.unmarkDone(activityId)
      : this.actService.markDone(activityId);

    request$.subscribe({
      next: () => window.dispatchEvent(new Event('activity-updated')),
      error: () => {
        // rollback on error
        if (isDone) this.completedIds.add(activityId);
        else this.completedIds.delete(activityId);
      }
    });
  }

  // ------------------ Add / Edit / Delete ------------------
  addActivity() {
    if (!this.newActivityName || this.currentType === null) return;

    const newActivity = {
      name: this.newActivityName,
      description: this.newActivityDescription,
      suggested: this.newActivitySuggested,
      type: this.currentType
    };

    this.actService.createActivity(newActivity).subscribe({
      next: () => this.loadActivitiesAndLogs(this.currentType),
      error: (err) => {
        console.error('Error adding activity:', err);
        this.addError = err.error?.message || 'Failed to create activity';
      }
    });
  }

startEdit(activity: Activity) {
  if (activity.suggested) return;

  const newName = prompt('Enter new name for activity', activity.name);
  if (!newName || newName.trim() === '' || newName === activity.name) return;

  // Call your existing update method
  this.editName = newName.trim();
  this.saveEdit(activity);
}


  saveEdit(activity: Activity) {
    if (activity.suggested) return;

    const updated = {
      name: this.editName,
      type: activity.type
    };

    this.actService.updateActivity(activity.id, updated).subscribe({
      next: () => this.loadActivitiesAndLogs(this.currentType),
      error: (err) => {
        console.error('Error updating activity:', err);
        this.editError = err.error?.message || 'Failed to update activity';
      }
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editError = '';
  }

  deleteActivity(activity: Activity) {
    if (activity.suggested) return;

    this.actService.deleteActivity(activity.id).subscribe({
      next: () => this.loadActivitiesAndLogs(this.currentType),
      error: (err) => {
        console.error('Error deleting activity:', err);
        this.deleteError = err.error?.message || 'Failed to delete activity';
      }
    });
  }
}
