import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActService } from '../service/act_serv';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule]
})
export class Dashboard implements OnInit {

  private actService = inject(ActService);

  // Plant growth
  totalPoints: number = 0;
  plantStage: number = 0;
  plantEmoji: string = '🟫';

  plantStages = [
    { stage: 0, emoji: '🟫', name: 'Land', threshold: 0 },
    { stage: 1, emoji: '🌱', name: 'Seed', threshold: 10 },
    { stage: 2, emoji: '🌿', name: 'Sprout', threshold: 50 },
    { stage: 3, emoji: '🪴', name: 'Plant', threshold: 100 },
    { stage: 4, emoji: '🌷', name: 'Flower', threshold: 200 },
    { stage: 5, emoji: '🌳', name: 'Tree', threshold: 300 }
  ];
  
  // UI state
  loading: boolean = true;
  error: string = '';

  async ngOnInit() {
    console.log('Dashboard initializing...');
    try {
      await this.fetchData();
      console.log('Data fetched successfully', {
        totalPoints: this.totalPoints,
        plantStage: this.plantStage
      });
      
      // Listen for activity updates (checkbox changes)
      window.addEventListener('activity-updated', this.handleActivityUpdate);
    } catch (err) {
      console.error('Error in ngOnInit:', err);
      this.error = 'Failed to load dashboard data';
    } finally {
      this.loading = false;
    }
  }
  
  // Handle activity updates from other components
  handleActivityUpdate = async () => {
    console.log('Activity update detected, refreshing dashboard data...');
    await this.fetchData();
  }
  
  ngOnDestroy() {
    window.removeEventListener('activity-updated', this.handleActivityUpdate);
  }

  async fetchData() {
    console.log('Fetching dashboard data...');
    try {
      // ✅ Directly get today's total points from backend
      this.totalPoints = await firstValueFrom(this.actService.getTodayPoints());

      // ✅ Update plant growth stage
      this.updatePlantStage();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      this.error = 'Failed to load data. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  updatePlantStage() {
    for (let i = this.plantStages.length - 1; i >= 0; i--) {
      if (this.totalPoints >= this.plantStages[i].threshold) {
        this.plantStage = i;
        this.plantEmoji = this.plantStages[i].emoji;
        break;
      }
    }
    console.log('Plant stage updated:', {
      stage: this.plantStage,
      emoji: this.plantEmoji,
      points: this.totalPoints
    });
  }

  getProgressToNextStage(): number {
    if (this.plantStage === this.plantStages.length - 1) {
      return 100;
    }
    const currentThreshold = this.plantStages[this.plantStage].threshold;
    const nextThreshold = this.plantStages[this.plantStage + 1].threshold;
    const progress = ((this.totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  getNextStageName(): string {
    if (this.plantStage === this.plantStages.length - 1) {
      return 'Max Level';
    }
    return this.plantStages[this.plantStage + 1].name;
  }
}
