import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Welcome } from './welcome/wel';
import { RouterModule } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
  styleUrls: ['app.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
   
    RouterModule,
    MatCardModule,
    HttpClientModule
   
]
})
export class App {
  
}
