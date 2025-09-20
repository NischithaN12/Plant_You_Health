import { Component, inject } from '@angular/core';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [MatCard, MatCardModule, MatIconModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  router = inject(Router);

onGetStarted(){
  this.router.navigate(['/login']);
}
}
