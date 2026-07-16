import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CropPriceService, CropPrice, TrendData } from '../../core/services/crop-price.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-crop-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tracker-page">
      <div class="container">
        <div class="page-header animate-fadeInUp">
          <span class="badge badge-accent">MARKET DATA</span>
          <h1>Crop Rate <span class="gradient-text">Tracker</span></h1>
          <p>Track real-time crop prices across Indian states. Data sourced from Government APIs.</p>
        </div>

        <!-- Search Panel -->
        <div class="search-panel card animate-fadeInUp" style="animation-delay: 0.1s">
          <div class="search-grid">
            <div class="form-group">
              <label for="search-state">State</label>
              <select id="search-state" class="form-control" [(ngModel)]="selectedState">
                <option value="">All States</option>
                <option *ngFor="let s of states" [value]="s">{{ s }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="search-crop">Commodity</label>
              <select id="search-crop" class="form-control" [(ngModel)]="selectedCommodity">
                <option value="">All Commodities</option>
                <option *ngFor="let c of commodities" [value]="c">{{ c }}</option>
              </select>
            </div>
            <div class="form-group search-actions">
              <button class="btn btn-primary" (click)="searchPrices()" [disabled]="searching">
                @if (searching) {
                  <span class="spinner" style="width:18px;height:18px;border-width:2px;"></span>
                } @else {
                  <span class="material-icons-outlined">search</span>
                }
                Search
              </button>
              <button class="btn btn-secondary" (click)="loadTrends()" [disabled]="!selectedCommodity || loadingTrends">
                <span class="material-icons-outlined">bar_chart</span>
                Trends
              </button>
            </div>
          </div>
        </div>

        <!-- Price Stats -->
        @if (prices.length > 0) {
          <div class="price-stats animate-fadeInUp">
            <div class="stat-card mini">
              <span class="stat-label">Avg Price</span>
              <span class="stat-value">₹{{ avgPrice | number:'1.0-0' }}</span>
            </div>
            <div class="stat-card mini">
              <span class="stat-label">Min Price</span>
              <span class="stat-value">₹{{ minPrice | number:'1.0-0' }}</span>
            </div>
            <div class="stat-card mini">
              <span class="stat-label">Max Price</span>
              <span class="stat-value">₹{{ maxPrice | number:'1.0-0' }}</span>
            </div>
            <div class="stat-card mini">
              <span class="stat-label">Markets</span>
              <span class="stat-value">{{ prices.length }}</span>
            </div>
          </div>
        }

        <!-- Charts -->
        <div class="charts-row">
          <div class="chart-card card" [class.visible]="showBarChart">
            <h3><span class="material-icons-outlined">bar_chart</span> Price Comparison by Market</h3>
            <div class="chart-wrapper">
              <canvas #barChartCanvas></canvas>
            </div>
          </div>
          <div class="chart-card card" [class.visible]="showTrendChart">
            <h3><span class="material-icons-outlined">show_chart</span> Price Trends by State</h3>
            <div class="chart-wrapper">
              <canvas #trendChartCanvas></canvas>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        @if (prices.length > 0) {
          <div class="table-card card animate-fadeInUp">
            <div class="table-header">
              <h3><span class="material-icons-outlined">table_chart</span> Price Data</h3>
              <span class="badge badge-secondary">{{ dataSource }} data</span>
            </div>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Market</th>
                    <th>Commodity</th>
                    <th>Variety</th>
                    <th>Min ₹</th>
                    <th>Max ₹</th>
                    <th>Modal ₹</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of prices; track $index) {
                    <tr>
                      <td>{{ p.state }}</td>
                      <td>{{ p.market || p.district }}</td>
                      <td><strong>{{ p.commodity }}</strong></td>
                      <td>{{ p.variety || '—' }}</td>
                      <td class="price-cell min">₹{{ p.min_price | number:'1.0-0' }}</td>
                      <td class="price-cell max">₹{{ p.max_price | number:'1.0-0' }}</td>
                      <td class="price-cell modal">₹{{ p.modal_price | number:'1.0-0' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (prices.length === 0 && !searching && searched) {
          <div class="empty-state card">
            <span style="font-size: 3rem; display: block; margin-bottom: 16px;">📊</span>
            <h4>No Data Found</h4>
            <p>Try a different state or commodity combination.</p>
          </div>
        }

        @if (!searched) {
          <div class="empty-state card animate-fadeInUp" style="animation-delay: 0.2s">
            <span style="font-size: 3rem; display: block; margin-bottom: 16px;">🔍</span>
            <h4>Search for Crop Prices</h4>
            <p>Select a state and/or commodity above to view market prices and trends.</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .tracker-page {
      padding: 100px 0 60px;
      min-height: 100vh;
      background: radial-gradient(ellipse at bottom left, rgba(245, 158, 11, 0.05), transparent 50%);
    }

    .page-header {
      text-align: center;
      margin-bottom: 32px;
      .badge { margin-bottom: 12px; }
      h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; }
      p { color: var(--text-secondary); font-size: 1.05rem; }
    }

    .search-panel { margin-bottom: 24px; }

    .search-grid {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 16px;
      align-items: end;
    }

    .search-actions {
      display: flex;
      gap: 8px;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .price-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card.mini {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      backdrop-filter: blur(12px);
      text-align: center;

      .stat-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      .stat-value {
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--primary);
      }
    }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-card {
      display: none;
      &.visible { display: block; }

      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
        font-weight: 700;
        margin-bottom: 16px;
      }
    }

    .chart-wrapper {
      position: relative;
      height: 300px;
    }

    .table-card {
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 700;
        }
      }
    }

    .table-scroll {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;

      th {
        text-align: left;
        padding: 12px 16px;
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid var(--border-color);
        white-space: nowrap;
      }

      td {
        padding: 12px 16px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        color: var(--text-secondary);
      }

      tr:hover td {
        background: rgba(255, 255, 255, 0.02);
      }
    }

    .price-cell {
      font-weight: 600;
      &.min { color: #34D399; }
      &.max { color: #F87171; }
      &.modal { color: var(--accent); }
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
      p { color: var(--text-muted); font-size: 0.9rem; }
    }

    @media (max-width: 768px) {
      .search-grid { grid-template-columns: 1fr; }
      .price-stats { grid-template-columns: repeat(2, 1fr); }
      .charts-row { grid-template-columns: 1fr; }
    }
  `],
})
export class CropTrackerComponent implements OnInit {
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChartCanvas') trendChartCanvas!: ElementRef<HTMLCanvasElement>;

  states: string[] = [];
  commodities: string[] = [];
  selectedState = '';
  selectedCommodity = '';
  prices: CropPrice[] = [];
  dataSource = '';
  searching = false;
  searched = false;
  loadingTrends = false;
  showBarChart = false;
  showTrendChart = false;

  avgPrice = 0;
  minPrice = 0;
  maxPrice = 0;

  private barChart: Chart | null = null;
  private trendChart: Chart | null = null;

  constructor(
    private cropPriceService: CropPriceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cropPriceService.getStates().subscribe(res => {
      this.states = res.data;
      this.cdr.markForCheck();
    });
    this.cropPriceService.getCommodities().subscribe(res => {
      this.commodities = res.data;
      this.cdr.markForCheck();
    });
  }

  searchPrices(): void {
    this.searching = true;
    this.searched = true;
    this.showBarChart = false;

    this.cropPriceService.search(this.selectedState, this.selectedCommodity).subscribe({
      next: (res) => {
        this.prices = res.data;
        this.dataSource = res.source;
        this.searching = false;
        
        if (this.prices.length > 0) {
          this.calculateStats();
          this.renderBarChart();
        }
        this.cdr.markForCheck();
      },
      error: () => { 
        this.searching = false; 
        this.prices = [];
        this.cdr.markForCheck();
      },
    });
  }

  loadTrends(): void {
    if (!this.selectedCommodity) return;
    this.loadingTrends = true;
    this.showTrendChart = false;

    this.cropPriceService.getTrends(this.selectedCommodity, this.selectedState).subscribe({
      next: (res) => {
        this.loadingTrends = false;
        if (res.data && res.data.length > 0) {
          this.renderTrendChart(res.data);
        }
        this.cdr.markForCheck();
      },
      error: () => { 
        this.loadingTrends = false; 
        this.cdr.markForCheck();
      },
    });
  }

  private calculateStats(): void {
    if (this.prices.length === 0) return;
    const modalPrices = this.prices.map(p => p.modal_price).filter(p => p > 0);
    this.avgPrice = modalPrices.reduce((a, b) => a + b, 0) / modalPrices.length;
    this.minPrice = Math.min(...this.prices.map(p => p.min_price).filter(p => p > 0));
    this.maxPrice = Math.max(...this.prices.map(p => p.max_price));
  }

  private renderBarChart(): void {
    if (!this.barChartCanvas || this.prices.length === 0) {
      this.showBarChart = false;
      return;
    }

    this.showBarChart = true;
    setTimeout(() => {
      if (this.barChart) this.barChart.destroy();

      const ctx = this.barChartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      const labels = this.prices.slice(0, 10).map(p => p.market || p.district || p.state);
      const minData = this.prices.slice(0, 10).map(p => p.min_price);
      const maxData = this.prices.slice(0, 10).map(p => p.max_price);
      const modalData = this.prices.slice(0, 10).map(p => p.modal_price);

      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Min Price ₹', data: minData, backgroundColor: 'rgba(52, 211, 153, 0.7)', borderRadius: 4 },
            { label: 'Modal Price ₹', data: modalData, backgroundColor: 'rgba(245, 158, 11, 0.7)', borderRadius: 4 },
            { label: 'Max Price ₹', data: maxData, backgroundColor: 'rgba(248, 113, 113, 0.7)', borderRadius: 4 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#94A3B8', font: { family: 'Inter' } } },
          },
          scales: {
            x: { ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(148,163,184,0.08)' } },
            y: { ticks: { color: '#64748B', font: { family: 'Inter' } }, grid: { color: 'rgba(148,163,184,0.08)' } },
          },
        },
      });
    }, 100);
  }

  private renderTrendChart(trendData: TrendData[]): void {
    if (!this.trendChartCanvas || trendData.length === 0) {
      this.showTrendChart = false;
      return;
    }

    this.showTrendChart = true;
    setTimeout(() => {
      if (this.trendChart) this.trendChart.destroy();

      const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      const colors = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

      const datasets = trendData.map((td, i) => ({
        label: td.state,
        data: td.prices.map(p => p.modal_price),
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '20',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: colors[i % colors.length],
      }));

      const maxLabels = Math.max(...trendData.map(td => td.prices.length));
      const labels = trendData[0]?.prices.map(p => p.market || p.date) ||
        Array.from({ length: maxLabels }, (_, i) => `Market ${i + 1}`);

      this.trendChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#94A3B8', font: { family: 'Inter' } } },
          },
          scales: {
            x: { ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(148,163,184,0.08)' } },
            y: { ticks: { color: '#64748B', font: { family: 'Inter' } }, grid: { color: 'rgba(148,163,184,0.08)' } },
          },
        },
      });
    }, 100);
  }
}
