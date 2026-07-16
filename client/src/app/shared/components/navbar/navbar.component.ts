import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="container nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">🌾</span>
          <span class="logo-text">Agro<span class="gradient-text">Smart</span></span>
        </a>

        <div class="nav-actions">
          <button class="theme-toggle" (click)="toggleTheme()">
            <span class="material-icons-outlined">
              {{ (isDarkTheme$ | async) ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>

          <button class="mobile-toggle" (click)="toggleMenu()" [class.active]="menuOpen">
            <span></span><span></span><span></span>
          </button>
        </div>

        <div class="nav-links" [class.open]="menuOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Home</a>

          @if (isLoggedIn) {
            <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Dashboard</a>
            <a routerLink="/recommend" routerLinkActive="active" (click)="closeMenu()">Recommend</a>
            <a routerLink="/crop-tracker" routerLinkActive="active" (click)="closeMenu()">Crop Tracker</a>

            <div class="user-menu">
              <button class="user-btn" (click)="toggleUserMenu()">
                <span class="user-avatar">{{ userName.charAt(0).toUpperCase() }}</span>
                <span class="user-name">{{ userName }}</span>
                <span class="material-icons-outlined">expand_more</span>
              </button>
              @if (userMenuOpen) {
                <div class="dropdown">
                  <a routerLink="/dashboard" (click)="closeAllMenus()">
                    <span class="material-icons-outlined">dashboard</span> Dashboard
                  </a>
                  <button (click)="logout()">
                    <span class="material-icons-outlined">logout</span> Logout
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/auth/login" class="btn btn-secondary btn-sm" (click)="closeMenu()">Sign In</a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm" (click)="closeMenu()">Sign Up</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 16px 0;
      transition: all 0.3s ease;
      background: transparent;
    }

    .navbar.scrolled {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      padding: 10px 0;
      box-shadow: var(--shadow-md);
      border-bottom: 1px solid var(--border-color);
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      text-decoration: none;
    }

    .logo-icon { font-size: 1.6rem; }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .theme-toggle {
      background: none;
      border: none;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 50%;
      transition: all 0.2s;
      
      &:hover {
        color: var(--primary);
        background: rgba(16, 185, 129, 0.1);
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;

      a:not(.btn) {
        padding: 8px 16px;
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.9rem;
        border-radius: var(--radius-sm);
        transition: all 0.2s;

        &:hover, &.active {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        &.active {
          color: var(--primary);
        }
      }
    }

    .user-menu {
      position: relative;
      margin-left: 8px;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary);
      }
    }

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .user-name {
      font-size: 0.85rem;
      font-weight: 500;
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 8px;
      min-width: 180px;
      box-shadow: var(--shadow-xl);
      animation: fadeInUp 0.2s ease;

      a, button {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        width: 100%;
        color: var(--text-secondary);
        font-size: 0.85rem;
        border-radius: 6px;
        background: none;
        border: none;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
      }
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;

      span {
        width: 24px;
        height: 2px;
        background: var(--text-primary);
        transition: all 0.3s;
      }

      &.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
      &.active span:nth-child(2) { opacity: 0; }
      &.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    }

    @media (max-width: 768px) {
      .mobile-toggle { display: flex; }

      .nav-links {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        flex-direction: column;
        padding: 24px;
        gap: 8px;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
        border-bottom: 1px solid var(--border-color);

        &.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        a:not(.btn) { width: 100%; }
        .user-menu { width: 100%; }
        .user-btn { width: 100%; }
      }
    }
  `],
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen = false;
  userMenuOpen = false;

  get isDarkTheme$() {
    return this.themeService.isDarkTheme$;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string {
    return this.authService.getCurrentUser()?.name || 'User';
  }

  constructor(
    private authService: AuthService, 
    private router: Router,
    private themeService: ThemeService
  ) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 50;
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }
  toggleUserMenu(): void { this.userMenuOpen = !this.userMenuOpen; }
  closeAllMenus(): void { this.menuOpen = false; this.userMenuOpen = false; }

  logout(): void {
    this.authService.logout();
    this.closeAllMenus();
    this.router.navigate(['/']);
  }
}
