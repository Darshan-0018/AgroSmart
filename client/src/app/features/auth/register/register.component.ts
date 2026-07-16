import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container animate-fadeInUp">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <a routerLink="/" class="auth-logo">🌾 Agro<span class="gradient-text">Smart</span></a>
            <h1>Create Account</h1>
            <p>Start getting AI-powered crop recommendations</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input id="name" type="text" class="form-control" [(ngModel)]="name" name="name" placeholder="Your full name" required />
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input id="email" type="email" class="form-control" [(ngModel)]="email" name="email" placeholder="Your email address" required />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-field">
                <input id="password" [type]="showPassword ? 'text' : 'password'" class="form-control"
                  [(ngModel)]="password" name="password" placeholder="Min 6 characters" required />
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                  <span class="material-icons-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="state">State (Optional)</label>
              <select id="state" class="form-control" [(ngModel)]="state" name="state">
                <option value="">Select your state</option>
                <option *ngFor="let s of states" [value]="s">{{ s }}</option>
              </select>
            </div>

            @if (error) {
              <div class="error-message">
                <span class="material-icons-outlined">error_outline</span>
                {{ error }}
              </div>
            }

            <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="loading">
              @if (loading) {
                <span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>
              } @else {
                <span class="material-icons-outlined">person_add</span>
                Create Account
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 100px 24px 60px;
      background-color: var(--bg-primary);
      background-image: radial-gradient(ellipse at top, rgba(16, 185, 129, 0.08), transparent 50%),
                        radial-gradient(ellipse at bottom right, rgba(99, 102, 241, 0.08), transparent 50%);
    }
    .auth-container { width: 100%; max-width: 440px; }
    .auth-card { padding: 40px; background: var(--bg-card); border: 1px solid var(--border-color); }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); text-decoration: none; display: inline-block; margin-bottom: 20px; }
    .auth-header h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; }
    .auth-header p { color: var(--text-muted); font-size: 0.9rem; }
    .password-field { position: relative; }
    .toggle-password {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;
      &:hover { color: var(--text-secondary); }
    }
    .error-message {
      display: flex; align-items: center; gap: 8px; padding: 12px 16px;
      border-radius: var(--radius-sm); background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2); color: #EF4444; font-size: 0.85rem; margin-bottom: 16px;
    }
    .submit-btn { width: 100%; margin-top: 8px; }
    .auth-footer {
      text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color);
      p { color: var(--text-muted); font-size: 0.9rem; }
      a { color: var(--primary); font-weight: 600; }
    }
  `],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  state = '';
  error = '';
  loading = false;
  showPassword = false;

  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Jammu and Kashmir', 'Puducherry',
  ];

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    if (authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.error = '';
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all required fields';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.authService.register({
      name: this.name, email: this.email,
      password: this.password, state: this.state,
    }).subscribe({
      next: () => { this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.cdr.markForCheck();
      },
    });
  }
}
