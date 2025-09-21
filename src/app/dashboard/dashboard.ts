import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActService, DailyPoints } from '../service/act_serv';
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
  totalPoints = 0;
  plantStage = 0;
  plantEmoji = '🟫';
  plantStages = [
    { stage: 0, emoji: '🟫', name: 'Land', threshold: 0 },
    { stage: 1, emoji: '🌱', name: 'Seed', threshold: 10 },
    { stage: 2, emoji: '🌿', name: 'Sprout', threshold: 50 },
    { stage: 3, emoji: '🪴', name: 'Plant', threshold: 100 },
    { stage: 4, emoji: '🌷', name: 'Flower', threshold: 200 },
    { stage: 5, emoji: '🌳', name: 'Tree', threshold: 300 }
  ];

  loading = true;
  error = '';

  // Weekly calendar
  currentWeekStart!: Date;
  weekDays: string[] = [];
  dailyPointsMap: Record<string, number> = {};
  selectedDay = '';

  async ngOnInit() {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    try {
      await this.fetchData();
      this.generateWeekDays();
      window.addEventListener('activity-updated', this.handleActivityUpdate);
    } catch (err) {
      console.error(err);
      this.error = 'Failed to load dashboard data';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('activity-updated', this.handleActivityUpdate);
  }

  handleActivityUpdate = async () => await this.fetchData();

  async fetchData() {
    this.loading = true;
    try {
      this.totalPoints = await firstValueFrom(this.actService.getTodayPoints());
      this.updatePlantStage();

      const dailyPoints: DailyPoints[] = await firstValueFrom(this.actService.getDailyPointsHistory());
      this.dailyPointsMap = {};
      dailyPoints.forEach(dp => {
        const key = new Date(dp.date).toISOString().split('T')[0];
        this.dailyPointsMap[key] = dp.points;
      });
    } catch (err) {
      console.error(err);
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
  }

  getProgressToNextStage(): number {
    if (this.plantStage === this.plantStages.length - 1) return 100;
    const curr = this.plantStages[this.plantStage].threshold;
    const next = this.plantStages[this.plantStage + 1].threshold;
    return Math.min(Math.max((this.totalPoints - curr) / (next - curr) * 100, 0), 100);
  }

  getNextStageName(): string {
    return this.plantStage === this.plantStages.length - 1 ? 'Max Level' : this.plantStages[this.plantStage + 1].name;
  }

  // --- Calendar helpers ---
  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    d.setDate(d.getDate() + diff);
    d.setHours(0,0,0,0);
    return d;
  }

  generateWeekDays() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      this.weekDays.push(d.toISOString().split('T')[0]);
    }
  }

  prevWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
  }

  selectDay(day: string) {
    this.selectedDay = day;
  }

  getMonthName(): string {
    return this.currentWeekStart.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
}
