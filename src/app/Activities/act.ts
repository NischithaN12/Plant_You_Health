import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'activitie-s',
  standalone: true,
  templateUrl: 'act.html',
  styleUrls: ['act.css'],
  imports: [MatTabsModule, MatIconModule, RouterModule],
})
export class ActivitieSComponent {}
