import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container animate-fadeInUp">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <a routerLink="/" class="auth-logo">🌾 Agro<span class="gradient-text">Smart</span></a>
            <h1>Set New Password</h1>
            <p>Please enter and confirm your new password below</p>
          </div>

          @if (isSuccess) {
            <div class="success-card">
              <div class="success-icon">
                <span class="material-icons-outlined">check_circle</span>
              </div>
              <h3>Password Reset!</h3>
              <p>{{ successMessage }}</p>
              <div class="action-buttons">
                <a routerLink="/auth/login" class="btn btn-primary btn-lg">
                  <span class="material-icons-outlined">login</span>
                  Sign In Now
                </a>
              </div>
            </div>
          } @else if (!token) {
            <div class="error-card">
              <div class="error-icon">
                <span class="material-icons-outlined">link_off</span>
              </div>
              <h3>Invalid Reset Link</h3>
              <p>This password reset link is invalid or incomplete.</p>
              <a routerLink="/auth/forgot-password" class="btn btn-primary" style="margin-top: 16px;">
                Request New Link
              </a>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-group">
                <label for="password">New Password</label>
                <div class="password-field">
                  <input
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    class="form-control"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="At least 6 characters"
                    required
                  />
                  <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                    <span class="material-icons-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <div class="password-field">
                  <input
                    id="confirmPassword"
                    [type]="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your new password"
                    required
                  />
                  <button type="button" class="toggle-password" (click)="showConfirmPassword = !showConfirmPassword">
                    <span class="material-icons-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
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
                  <span class="material-icons-outlined">lock_reset</span>
                  Update Password
                }
              </button>
            </form>

            <div class="auth-footer">
              <p>Remembered your password? <a routerLink="/auth/login">Back to Sign In</a></p>
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
    }

    .password-field {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;

      &:hover { color: var(--text-secondary); }
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

    .success-card, .error-card {
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

      .error-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
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
        margin-bottom: 16px;
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
export class ResetPasswordComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  error = '';
  successMessage = '';
  isSuccess = false;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit(): void {
    this.error = '';

    if (!this.password || !this.confirmPassword) {
      this.error = 'Please fill in both password fields';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.isSuccess = true;
        this.successMessage = res.message || 'Password has been updated successfully!';
        this.cdr.markForCheck();

        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Password reset failed. Link may be expired.';
        this.cdr.markForCheck();
      },
    });
  }
}
