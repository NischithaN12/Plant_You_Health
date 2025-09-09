import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActService } from '../service/act_serv';

@Component({
  standalone: true,
  selector: 'activities',
  templateUrl: 'act.html',
  styleUrls: ['act.css'],
  imports: [MatTabsModule, CommonModule, MatIconModule, JsonPipe, FormsModule]
})
export class act implements OnInit {
  private actService = inject(ActService);

  currentType: string | undefined = undefined;
  activities: any[] = [];
  loading = false;

  // Errors per operation
  fetchError = '';
  addError = '';
  editError = '';
  deleteError = '';

  // New activity inputs
  newActivityName = '';
  newActivityDescription = '';
  newActivitySuggested = false;

  // Editing state
  editingId: number | null = null;
  editName = '';
  editDescription = '';
  editSuggested = false;

  ngOnInit() {
    this.fetchActivities();
  }

  fetchActivities(type?: string) {
    this.loading = true;
    this.fetchError = '';
    this.actService.getAllActivities(type).subscribe({
      next: (data: any) => {
        this.activities = data;
        this.loading = false;
      },
      error: (err) => {
        this.fetchError = 'Failed to load activities';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onTabChange(event: any) {
    const tabs = ['', 'EXERCISE', 'HYDRATION', 'YOGA', 'FOOD'];
    this.currentType = tabs[event.index] || undefined;
    this.fetchActivities(this.currentType);
  }

  addActivity() {
    this.addError = '';
    const newActivity = {
      name: this.newActivityName,
      description: this.newActivityDescription,
      suggested: this.newActivitySuggested,
      type: this.currentType ?? 'EXERCISE'
    };

    this.actService.createActivity(newActivity).subscribe({
      next: () => {
        this.fetchActivities(this.currentType);
        this.newActivityName = '';
        this.newActivityDescription = '';
        this.newActivitySuggested = false;
      },
      error: (err) => {
        this.addError = 'Failed to create activity';
        console.error(err);
      }
    });
  }

  startEdit(activity: any) {
    this.editingId = activity.id;
    this.editName = activity.name;
    this.editDescription = activity.description;
    this.editSuggested = activity.suggested;
    this.editError = '';
  }

  saveEdit(activity: any) {
    this.editError = '';
    const updated = {
      name: this.editName,
      description: this.editDescription,
      suggested: this.editSuggested,
      type: activity.type
    };

    this.actService.updateActivity(activity.id, updated).subscribe({
      next: () => {
        this.editingId = null;
        this.fetchActivities(this.currentType);
      },
      error: (err) => {
        this.editError = 'Failed to update activity';
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editError = '';
  }

  deleteActivity(id: number) {
    this.deleteError = '';
    // Optimistic UI update
    const index = this.activities.findIndex(a => a.id === id);
    if (index > -1) this.activities.splice(index, 1);

    this.actService.deleteActivity(id).subscribe({
      next: () => { },
      error: (err) => {
        this.deleteError = 'Failed to delete activity';
        console.error(err);
        // If delete fails, refetch to sync state
        this.fetchActivities(this.currentType);
      }
    });
  }
}
