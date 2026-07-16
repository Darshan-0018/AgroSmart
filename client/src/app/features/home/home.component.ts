import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
        <div class="particle p5"></div>
        <div class="gradient-orb orb1"></div>
        <div class="gradient-orb orb2"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-badge animate-fadeInUp">
          <span class="material-icons-outlined">auto_awesome</span>
          AI-Powered Agriculture
        </div>
        <h1 class="hero-title animate-fadeInUp" style="animation-delay: 0.1s">
          Optimize Your Yield with<br>
          <span class="gradient-text">Next-Gen AI Crop Recommendations</span>
        </h1>
        <p class="hero-subtitle animate-fadeInUp" style="animation-delay: 0.2s">
          Harness advanced machine learning to discover the optimal crops for your specific soil and weather conditions. Access real-time agricultural market prices nationwide.
        </p>
        <div class="hero-actions animate-fadeInUp" style="animation-delay: 0.3s">
          @if (authService.isLoggedIn()) {
            <a routerLink="/recommend" class="btn btn-primary btn-lg">
              <span class="material-icons-outlined">psychology</span>
              Get Recommendation
            </a>
            <a routerLink="/crop-tracker" class="btn btn-secondary btn-lg">
              <span class="material-icons-outlined">trending_up</span>
              Track Prices
            </a>
          } @else {
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">
              <span class="material-icons-outlined">rocket_launch</span>
              Get Started Free
            </a>
            <a routerLink="/auth/login" class="btn btn-secondary btn-lg">
              Sign In
            </a>
          }
        </div>
        <div class="hero-stats animate-fadeInUp" style="animation-delay: 0.4s">
          <div class="stat">
            <span class="stat-value">22+</span>
            <span class="stat-label">Crop Types</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">36</span>
            <span class="stat-label">States & UTs</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">95%+</span>
            <span class="stat-label">Accuracy</span>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section how-it-works">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-primary">HOW IT WORKS</span>
          <h2>Three Simple Steps to Better Farming</h2>
          <p>Our AI analyzes your soil and weather data to recommend the most suitable crops for maximum yield.</p>
        </div>
        <div class="steps-grid">
          <div class="step-card" *ngFor="let step of steps; let i = index">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section features">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-secondary">FEATURES</span>
          <h2>Everything You Need for Smart Agriculture</h2>
        </div>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon-wrapper">
              <span class="material-icons-outlined">{{ feature.icon }}</span>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Crops Showcase -->
    <section class="section crops-showcase">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-accent">SUPPORTED CROPS</span>
          <h2>22+ Crops in Our Database</h2>
          <p>From staple grains to cash crops, our AI model supports a wide variety of Indian agriculture.</p>
        </div>
        <div class="crops-scroll">
          <div class="crop-tag" *ngFor="let crop of crops">
            <span>{{ crop.icon }}</span> {{ crop.name }}
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-card glass-card">
          <h2>Ready to Grow Smarter?</h2>
          <p>Join thousands of farmers using AI to make better crop decisions. Start for free today.</p>
          <div class="cta-actions">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">
              <span class="material-icons-outlined">rocket_launch</span>
              Create Free Account
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding-top: 80px;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
    }

    .orb1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--primary), transparent);
      top: -200px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }

    .orb2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, var(--secondary), transparent);
      bottom: -100px;
      left: -100px;
      animation: float 10s ease-in-out infinite reverse;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--primary);
      border-radius: 50%;
      opacity: 0.4;
      animation: float 6s ease-in-out infinite;
    }

    .p1 { top: 20%; left: 10%; animation-delay: 0s; }
    .p2 { top: 60%; left: 80%; animation-delay: 1s; }
    .p3 { top: 40%; left: 50%; animation-delay: 2s; background: var(--secondary); }
    .p4 { top: 80%; left: 20%; animation-delay: 3s; background: var(--accent); }
    .p5 { top: 30%; left: 70%; animation-delay: 4s; }

    .hero-content {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 1px;
      color: var(--primary);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      margin-bottom: 24px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 24px;
      letter-spacing: -1px;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: 36px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--primary);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border-color);
    }

    /* Section Headers */
    .section-header {
      text-align: center;
      margin-bottom: 60px;

      .badge { margin-bottom: 16px; }

      h2 {
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 16px;
        letter-spacing: -0.5px;
      }

      p {
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
        font-size: 1.05rem;
      }
    }

    /* Steps */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .step-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 36px 28px;
      text-align: center;
      position: relative;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        border-color: var(--border-glow);
        box-shadow: var(--shadow-glow);
      }
    }

    .step-number {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .step-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    .step-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .step-card p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    /* Features */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 28px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        border-color: var(--border-glow);
        box-shadow: var(--shadow-glow);
      }
    }

    .feature-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: rgba(16, 185, 129, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;

      .material-icons-outlined {
        font-size: 24px;
        color: var(--primary);
      }
    }

    .feature-card:nth-child(2) .feature-icon-wrapper,
    .feature-card:nth-child(5) .feature-icon-wrapper {
      background: rgba(99, 102, 241, 0.1);
      .material-icons-outlined { color: var(--secondary); }
    }

    .feature-card:nth-child(3) .feature-icon-wrapper,
    .feature-card:nth-child(6) .feature-icon-wrapper {
      background: rgba(245, 158, 11, 0.1);
      .material-icons-outlined { color: var(--accent); }
    }

    .feature-card h3 {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.88rem;
      line-height: 1.6;
    }

    /* Crops Showcase */
    .crops-scroll {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }

    .crop-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.3s;

      &:hover {
        border-color: var(--primary);
        color: var(--primary);
        transform: translateY(-2px);
      }
    }

    /* CTA */
    .cta-section {
      padding-bottom: 100px;
    }

    .cta-card {
      text-align: center;
      padding: 60px 40px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.1));
      border: 1px solid rgba(16, 185, 129, 0.2);

      h2 {
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 16px;
      }

      p {
        color: var(--text-secondary);
        font-size: 1.05rem;
        margin-bottom: 32px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .cta-actions {
      display: flex;
      justify-content: center;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title { font-size: 2.2rem; }
      .hero-subtitle { font-size: 1rem; }
      .steps-grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .hero-stats { gap: 20px; }
      .stat-value { font-size: 1.4rem; }
    }

    @media (max-width: 1024px) {
      .features-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `],
})
export class HomeComponent {
  steps = [
    { icon: '📋', title: 'Enter Your Data', description: 'Provide your soil nutrients (N, P, K), temperature, humidity, pH, and rainfall data.' },
    { icon: '🤖', title: 'AI Analysis', description: 'Our machine learning model analyzes your data using a trained Random Forest algorithm.' },
    { icon: '🌾', title: 'Get Recommendations', description: 'Receive top crop recommendations with confidence scores and growing tips.' },
  ];

  features = [
    { icon: 'psychology', title: 'AI-Powered Predictions', description: 'Random Forest ML model trained on 2200+ data points for accurate crop recommendations.' },
    { icon: 'trending_up', title: 'Real-time Price Tracking', description: 'Track crop prices across Indian states with data from government APIs.' },
    { icon: 'bar_chart', title: 'Interactive Charts', description: 'Visualize price trends, compare markets, and analyze data with dynamic charts.' },
    { icon: 'location_on', title: '36 States & UTs', description: 'Coverage across all Indian states and territories with localized crop and price data.' },
    { icon: 'history', title: 'Recommendation History', description: 'Save and review all your past crop recommendations in your dashboard.' },
    { icon: 'security', title: 'Secure & Private', description: 'JWT-based authentication keeps your data safe and your sessions secure.' },
  ];

  crops = [
    { name: 'Rice', icon: '🌾' }, { name: 'Maize', icon: '🌽' },
    { name: 'Chickpea', icon: '🫘' }, { name: 'Kidney Beans', icon: '🫘' },
    { name: 'Pigeon Peas', icon: '🫛' }, { name: 'Moth Beans', icon: '🫘' },
    { name: 'Mung Bean', icon: '🫘' }, { name: 'Black Gram', icon: '🫘' },
    { name: 'Lentil', icon: '🫘' }, { name: 'Pomegranate', icon: '🍎' },
    { name: 'Banana', icon: '🍌' }, { name: 'Mango', icon: '🥭' },
    { name: 'Grapes', icon: '🍇' }, { name: 'Watermelon', icon: '🍉' },
    { name: 'Muskmelon', icon: '🍈' }, { name: 'Apple', icon: '🍎' },
    { name: 'Orange', icon: '🍊' }, { name: 'Papaya', icon: '🍈' },
    { name: 'Coconut', icon: '🥥' }, { name: 'Cotton', icon: '🌿' },
    { name: 'Jute', icon: '🌿' }, { name: 'Coffee', icon: '☕' },
  ];

  constructor(public authService: AuthService) {}
}
