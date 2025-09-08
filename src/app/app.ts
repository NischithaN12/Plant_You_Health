import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Login_Signup } from "./Login_Signup/ls";
import { Profile_SetupComponent } from "./Profile_setup/ps";




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
    RouterLink,
    Login_Signup,
   
    Profile_SetupComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Frontend');

  isLinear = true;
  firstFormGroup: any;
  secondFormGroup: any;

  constructor(private router: Router, private _formBuilder: FormBuilder) {}
ngOnInit() {
  this.firstFormGroup = this._formBuilder.group({}); // no validators, always valid
  this.secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required]
  });
}

  goToLogin() {
                   // move stepper to Step 2
    this.router.navigate(['/login']); // load LoginComponent inside router-outlet
  }
  goToProfile() {
                   // move stepper to Step 3
    this.router.navigate(['/profile']); // load ProfileSetupComponent inside router-outlet
  }
}
