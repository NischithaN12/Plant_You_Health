import { Component, inject, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
 
import { CommonModule, JsonPipe } from '@angular/common';
import { ActService } from '../service/act_serv';
 
 
/**
* @title Tab group animations
*/
@Component({
  standalone: true,
  selector: 'activities',
  templateUrl: 'act.html',
  styleUrl: 'act.css',
  imports: [MatTabsModule,CommonModule, MatIconModule, JsonPipe],
})
export class act {
  private actService = inject(ActService);

  activities: any[] = [];
  loading = false;
  error = '';

  onTabChange(event: any) {
    this.loading = true;
    let type: string | undefined = undefined;
    if (event.index === 1) type = 'EXERCISE';
    if (event.index === 2) type = 'HYDRATION';
    if (event.index === 3) type = 'YOGA';
    if(event.index === 4) type = 'FOOD';

    this.actService.getAllActivities(type).subscribe({
      next: (data: any) => {
        this.activities = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load activities';
        this.loading = false;
      }
    });
  }
}