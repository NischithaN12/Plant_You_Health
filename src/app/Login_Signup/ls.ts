import { Component, signal } from '@angular/core';
import { FormControl, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './ls.html',
  styleUrls: ['./ls.css']
})
export class Login_Signup {
  hidePassword = signal(true);
  isLoginMode = signal(true);
  loginFailed = signal(false);
  loginForm = new FormGroup({
    usernameOrEmail: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  
  // Subscribe to form changes to clear error state when user starts typing
  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginFailed()) {
        this.loginFailed.set(false);
      }
    });
  }

  signupForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode() {
    if (this.isLoginMode()) {
      const val = this.loginForm.value.usernameOrEmail;
      if (val) {
        this.signupForm.patchValue({ email: val, username: val });
      }
    }
    this.isLoginMode.set(!this.isLoginMode());
    this.loginFailed.set(false);
  }
login() {
  if (this.loginForm.invalid) return;
  const { usernameOrEmail, password } = this.loginForm.value;

  this.auth.login(usernameOrEmail!, password!).subscribe({
    next: res => {
      alert(`Welcome ${res.username}!`);
      this.router.navigate(['/welcome'])
      this.loginFailed.set(false);
    },
    error: () => this.loginFailed.set(true)
  });
}


signup() {
  if (this.signupForm.invalid) return;
  const { username, email, password, confirmPassword } = this.signupForm.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  this.auth.signup(username!, email!, password!).subscribe({
    next: res => {
      alert(`Signup successful! Welcome ${res.username}`);
      this.toggleMode();
    },
    error: err => alert(err.error.detail || 'Signup failed')
  });
  
}
togglePassword() {
  this.hidePassword.set(!this.hidePassword());
}
}

