import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a routerLink="/" class="logo">
              <span>🌾</span>
              <span class="logo-text">Agro<span class="gradient-text">Smart</span></span>
            </a>
            <p>AI-powered crop recommendation system helping Indian farmers make data-driven decisions.</p>
          </div>

          <div class="footer-links">
            <h4>Platform</h4>
            <a routerLink="/recommend">Crop Recommendation</a>
            <a routerLink="/crop-tracker">Price Tracker</a>
            <a routerLink="/dashboard">Dashboard</a>
          </div>

          <div class="footer-links">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Support</a>
          </div>

          <div class="footer-links">
            <h4>Connect</h4>
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 AgroSmart. Built with 💚 for Indian Agriculture</p>
          <p class="tech-stack">MEAN Stack • Python ML • Chart.js</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: 60px 0 24px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-brand {
      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--text-primary);
        text-decoration: none;
        margin-bottom: 12px;
      }

      p {
        color: var(--text-muted);
        font-size: 0.9rem;
        line-height: 1.6;
        max-width: 320px;
      }
    }

    .footer-links {
      h4 {
        color: var(--text-primary);
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 16px;
      }

      a {
        display: block;
        color: var(--text-muted);
        font-size: 0.85rem;
        padding: 6px 0;
        transition: color 0.2s;

        &:hover {
          color: var(--primary);
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        color: var(--text-muted);
        font-size: 0.8rem;
      }

      .tech-stack {
        color: var(--text-muted);
        font-size: 0.75rem;
        opacity: 0.7;
      }
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 30px;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class FooterComponent {}
