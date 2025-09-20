import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ActService } from '../service/act_serv';

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
  activities: any[] = [];
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
    logs: this.actService.getTodayLogs(type || undefined) // pass the type here
  }).subscribe({
    next: ({ activities, logs }) => {
      // ✅ Normalize activity IDs to numbers
      this.activities = activities.map(act => ({
        ...act,
        id: Number(act.id)
      }));

      // ✅ Clear and rebuild completed IDs set
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
  toggleDone(activity: any) {
    const activityId = Number(activity.id);
    const isDone = this.completedIds.has(activityId);

    // Optimistic UI update
    if (isDone) this.completedIds.delete(activityId);
    else this.completedIds.add(activityId);

    const request$: Observable<any> = isDone
      ? this.actService.unmarkDone(activityId)
      : this.actService.markDone(activityId);

    request$.subscribe({
      next: () => {
        // Dispatch event to update dashboard plant stage if needed
        window.dispatchEvent(new Event('activity-updated'));
      },
      error: () => {
        // Rollback UI if API fails
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

  startEdit(activity: any) {
    if (activity.suggested) return;
    this.editingId = activity.id;
    this.editName = activity.name;
    this.editDescription = activity.description;
    this.editSuggested = activity.suggested;
  }

  saveEdit(activity: any) {
    if (activity.suggested) return;

    const updated = {
      name: this.editName,
      description: this.editDescription,
      suggested: this.editSuggested,
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

  deleteActivity(activity: any) {
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
