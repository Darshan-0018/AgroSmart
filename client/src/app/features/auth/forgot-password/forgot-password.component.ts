import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container animate-fadeInUp">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <a routerLink="/" class="auth-logo">🌾 Agro<span class="gradient-text">Smart</span></a>
            <h1>Forgot Password?</h1>
            <p>No worries! Enter your registered email address and we'll send you instructions to reset your password.</p>
          </div>

          @if (successMessage) {
            <div class="success-card">
              <div class="success-icon">
                <span class="material-icons-outlined">mark_email_read</span>
              </div>
              <h3>Check Your Email</h3>
              <p>{{ successMessage }}</p>
              <p class="sub-text">
                Didn't receive an email? Check your spam folder or try requesting again below.
              </p>
              <div class="action-buttons">
                <button type="button" class="btn btn-secondary" (click)="resetForm()">
                  Try another email
                </button>
                <a routerLink="/auth/login" class="btn btn-primary">
                  Back to Login
                </a>
              </div>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="Enter your registered email"
                  required
                />
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
                  <span class="material-icons-outlined">send</span>
                  Send Reset Link
                }
              </button>
            </form>

            <div class="auth-footer">
              <p>Remember your password? <a routerLink="/auth/login">Back to Sign In</a></p>
            </div>
          }
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

    .auth-card {
      padding: 40px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .auth-logo {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-primary);
      text-decoration: none;
      display: inline-block;
      margin-bottom: 20px;
    }

    .auth-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .auth-header p {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #EF4444;
      font-size: 0.85rem;
      margin-bottom: 16px;
    }

    .success-card {
      text-align: center;
      padding: 10px 0;

      .success-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.15);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;

        span { font-size: 32px; }
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
        font-size: 0.92rem;
        line-height: 1.5;
        margin-bottom: 8px;
      }

      .sub-text {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin-bottom: 24px;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }

    .submit-btn {
      width: 100%;
      margin-top: 8px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);

      p {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      a {
        color: var(--primary);
        font-weight: 600;
      }
    }
  `],
})
export class ForgotPasswordComponent {
  email = '';
  error = '';
  successMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.email) {
      this.error = 'Please enter your email address';
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Password reset link sent to your email!';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to process request. Please try again.';
        this.cdr.markForCheck();
      },
    });
  }

  resetForm(): void {
    this.email = '';
    this.error = '';
    this.successMessage = '';
    this.loading = false;
    this.cdr.markForCheck();
  }
}
