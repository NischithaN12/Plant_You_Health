import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-root',
    imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    RouterOutlet,
    
],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Frontend');

  isLinear = true;


  constructor(private router: Router) {}

  goToLogin() {
                   // move stepper to Step 2
    this.router.navigate(['/login']); // load LoginComponent inside router-outlet
  }
  goToProfile() {
                   // move stepper to Step 3
    this.router.navigate(['/profile']); // load ProfileSetupComponent inside router-outlet
  }
}
