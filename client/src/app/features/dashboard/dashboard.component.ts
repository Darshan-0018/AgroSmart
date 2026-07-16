import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { RecommendationService, Recommendation } from '../../core/services/recommendation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-page">
      <div class="container">
        <!-- Welcome Banner -->
        <div class="welcome-banner animate-fadeInUp">
          <div class="welcome-content">
            <h1>Welcome back, <span class="gradient-text">{{ user?.name || 'Farmer' }}</span> 👋</h1>
            <p>Here's your crop recommendation activity overview.</p>
          </div>
          <div class="welcome-actions">
            <a routerLink="/recommend" class="btn btn-primary">
              <span class="material-icons-outlined">psychology</span>
              New Recommendation
            </a>
            <a routerLink="/crop-tracker" class="btn btn-secondary">
              <span class="material-icons-outlined">trending_up</span>
              Track Prices
            </a>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid animate-fadeInUp" style="animation-delay: 0.1s">
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1);">
              <span class="material-icons-outlined" style="color: var(--primary);">psychology</span>
            </div>
            <div>
              <span class="stat-value">{{ totalRecommendations }}</span>
              <span class="stat-label">Total Recommendations</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(99, 102, 241, 0.1);">
              <span class="material-icons-outlined" style="color: var(--secondary);">eco</span>
            </div>
            <div>
              <span class="stat-value">{{ uniqueCrops }}</span>
              <span class="stat-label">Crops Explored</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1);">
              <span class="material-icons-outlined" style="color: var(--accent);">location_on</span>
            </div>
            <div>
              <span class="stat-value">{{ user?.state || 'N/A' }}</span>
              <span class="stat-label">Your State</span>
            </div>
          </div>
        </div>

        <!-- Crop Distribution -->
        @if (cropDistribution.length > 0) {
          <div class="card distribution-card animate-fadeInUp" style="animation-delay: 0.2s">
            <h3><span class="material-icons-outlined">bar_chart</span> Recommendation Distribution</h3>
            <div class="distribution-bars">
              @for (item of cropDistribution; track item._id) {
                <div class="dist-item">
                  <div class="dist-header">
                    <span class="dist-name">{{ item._id }}</span>
                    <span class="dist-count">{{ item.count }}</span>
                  </div>
                  <div class="dist-bar-bg">
                    <div class="dist-bar" [style.width.%]="(item.count / maxCropCount) * 100"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Recent Recommendations -->
        <div class="recent-section animate-fadeInUp" style="animation-delay: 0.3s">
          <div class="section-title">
            <h3><span class="material-icons-outlined">history</span> Recent Recommendations</h3>
            @if (recentRecommendations.length > 0) {
              <a routerLink="/recommend" class="view-all">View All →</a>
            }
          </div>

          @if (loading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading your data...</p>
            </div>
          } @else if (recentRecommendations.length === 0) {
            <div class="empty-state card">
              <span class="empty-icon">🌱</span>
              <h4>No Recommendations Yet</h4>
              <p>Start by getting your first AI-powered crop recommendation!</p>
              <a routerLink="/recommend" class="btn btn-primary">
                <span class="material-icons-outlined">psychology</span>
                Get Your First Recommendation
              </a>
            </div>
          } @else {
            <div class="recommendations-grid">
              @for (rec of recentRecommendations; track rec._id) {
                <div class="rec-card card">
                  <div class="rec-header">
                    <span class="rec-crop">{{ getCropIcon(rec.prediction) }} {{ rec.prediction }}</span>
                    <span class="badge badge-primary">{{ rec.recommendations[0]?.confidence || 0 }}%</span>
                  </div>
                  <div class="rec-details">
                    <div class="rec-detail">
                      <span class="detail-label">N/P/K</span>
                      <span class="detail-value">{{ rec.inputs.N }}/{{ rec.inputs.P }}/{{ rec.inputs.K }}</span>
                    </div>
                    <div class="rec-detail">
                      <span class="detail-label">Temp</span>
                      <span class="detail-value">{{ rec.inputs.temperature | number:'1.0-1' }}°C</span>
                    </div>
                    <div class="rec-detail">
                      <span class="detail-label">pH</span>
                      <span class="detail-value">{{ rec.inputs.ph | number:'1.1-1' }}</span>
                    </div>
                  </div>
                  <div class="rec-date">
                    <span class="material-icons-outlined">schedule</span>
                    {{ formatDate(rec.createdAt) }}
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .dashboard-page {
      padding: 100px 0 60px;
      min-height: 100vh;
    }

    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px 36px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(99, 102, 241, 0.08));
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      margin-bottom: 28px;

      h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 6px; }
      p { color: var(--text-secondary); font-size: 0.95rem; }
    }

    .welcome-actions {
      display: flex;
      gap: 12px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      backdrop-filter: blur(12px);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-value {
      display: block;
      font-size: 1.4rem;
      font-weight: 800;
    }

    .stat-label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .distribution-card {
      margin-bottom: 28px;

      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 20px;
      }
    }

    .distribution-bars {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .dist-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .dist-name {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .dist-count {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .dist-bar-bg {
      height: 6px;
      border-radius: 3px;
      background: var(--bg-tertiary);
    }

    .dist-bar {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      transition: width 0.8s ease;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.05rem;
        font-weight: 700;
      }

      .view-all {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary);
      }
    }

    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .rec-card {
      padding: 20px;
    }

    .rec-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .rec-crop {
      font-size: 1.05rem;
      font-weight: 700;
      text-transform: capitalize;
    }

    .rec-details {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }

    .rec-detail {
      flex: 1;
      padding: 8px 12px;
      background: var(--bg-secondary);
      border-radius: 6px;
      text-align: center;
    }

    .detail-label {
      display: block;
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 2px;
    }

    .rec-date {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-muted);

      .material-icons-outlined { font-size: 14px; }
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;

      .empty-icon { font-size: 3rem; display: block; margin-bottom: 16px; }
      h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
      p { color: var(--text-muted); margin-bottom: 24px; font-size: 0.9rem; }
    }

    .loading-state {
      text-align: center;
      padding: 48px;
      p { color: var(--text-muted); margin-top: 16px; }
      .spinner { margin: 0 auto; }
    }

    @media (max-width: 768px) {
      .welcome-banner { flex-direction: column; gap: 16px; text-align: center; }
      .welcome-actions { justify-content: center; }
      .stats-grid { grid-template-columns: 1fr; }
      .recommendations-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  recentRecommendations: Recommendation[] = [];
  cropDistribution: { _id: string; count: number }[] = [];
  totalRecommendations = 0;
  uniqueCrops = 0;
  maxCropCount = 1;
  loading = true;

  private cropIcons: Record<string, string> = {
    rice: '🌾', maize: '🌽', chickpea: '🫘', kidneybeans: '🫘',
    pigeonpeas: '🫛', mothbeans: '🫘', mungbean: '🫘', blackgram: '🫘',
    lentil: '🫘', pomegranate: '🍎', banana: '🍌', mango: '🥭',
    grapes: '🍇', watermelon: '🍉', muskmelon: '🍈', apple: '🍎',
    orange: '🍊', papaya: '🍈', coconut: '🥥', cotton: '🌿',
    jute: '🌿', coffee: '☕',
  };

  constructor(
    private authService: AuthService,
    private recommendationService: RecommendationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats(): void {
    this.recommendationService.getStats().subscribe({
      next: (res) => {
        this.totalRecommendations = res.data.totalRecommendations;
        this.cropDistribution = res.data.cropDistribution;
        this.recentRecommendations = res.data.recentRecommendations;
        this.uniqueCrops = this.cropDistribution.length;
        this.maxCropCount = Math.max(...this.cropDistribution.map(c => c.count), 1);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { 
        this.loading = false;
        this.cdr.markForCheck(); 
      },
    });
  }

  getCropIcon(crop: string): string {
    return this.cropIcons[crop.toLowerCase()] || '🌱';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
}
