import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecommendationService, CropRecommendation } from '../../core/services/recommendation.service';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="recommend-page">
      <div class="container">
        <div class="page-header animate-fadeInUp">
          <span class="badge badge-primary">AI RECOMMENDATION</span>
          <h1>Get Crop <span class="gradient-text">Recommendations</span></h1>
          <p>Enter your soil and weather data to receive AI-powered crop suggestions.</p>
        </div>

        @if (!showResults) {
          <!-- Multi-step Form -->
          <div class="form-container animate-fadeInUp" style="animation-delay: 0.1s">
            <!-- Progress Bar -->
            <div class="progress-bar">
              <div class="progress-steps">
                @for (s of stepLabels; track s; let i = $index) {
                  <div class="progress-step" [class.active]="step >= i + 1" [class.current]="step === i + 1">
                    <div class="step-circle">{{ i + 1 }}</div>
                    <span class="step-text">{{ s }}</span>
                  </div>
                }
              </div>
              <div class="progress-track">
                <div class="progress-fill" [style.width.%]="((step - 1) / 2) * 100"></div>
              </div>
            </div>

            <form (ngSubmit)="onSubmit()" class="rec-form">
              <!-- Step 1: Soil -->
              @if (step === 1) {
                <div class="step-content animate-fadeIn">
                  <h3>🧪 Soil Nutrients</h3>
                  <p class="step-desc">Enter the nutrient content ratio of your soil.</p>
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="nitrogen">Nitrogen (N)</label>
                      <input id="nitrogen" type="number" class="form-control" [(ngModel)]="form.N" name="N" placeholder="e.g., 90" required min="0" max="200" />
                      <span class="form-hint">kg/ha — typical range: 0-140</span>
                    </div>
                    <div class="form-group">
                      <label for="phosphorus">Phosphorus (P)</label>
                      <input id="phosphorus" type="number" class="form-control" [(ngModel)]="form.P" name="P" placeholder="e.g., 42" required min="0" max="200" />
                      <span class="form-hint">kg/ha — typical range: 5-145</span>
                    </div>
                    <div class="form-group">
                      <label for="potassium">Potassium (K)</label>
                      <input id="potassium" type="number" class="form-control" [(ngModel)]="form.K" name="K" placeholder="e.g., 43" required min="0" max="210" />
                      <span class="form-hint">kg/ha — typical range: 5-205</span>
                    </div>
                    <div class="form-group">
                      <label for="ph">Soil pH</label>
                      <input id="ph" type="number" step="0.1" class="form-control" [(ngModel)]="form.ph" name="ph" placeholder="e.g., 6.5" required min="0" max="14" />
                      <span class="form-hint">Acidity/Alkalinity — range: 0-14</span>
                    </div>
                  </div>
                </div>
              }

              <!-- Step 2: Weather -->
              @if (step === 2) {
                <div class="step-content animate-fadeIn">
                  <h3>🌤️ Weather Conditions</h3>
                  <p class="step-desc">Provide the climate data for your area.</p>
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="temperature">Temperature (°C)</label>
                      <input id="temperature" type="number" step="0.1" class="form-control" [(ngModel)]="form.temperature" name="temperature" placeholder="e.g., 25.5" required />
                      <span class="form-hint">Average temperature in Celsius</span>
                    </div>
                    <div class="form-group">
                      <label for="humidity">Humidity (%)</label>
                      <input id="humidity" type="number" step="0.1" class="form-control" [(ngModel)]="form.humidity" name="humidity" placeholder="e.g., 80" required min="0" max="100" />
                      <span class="form-hint">Relative humidity percentage</span>
                    </div>
                    <div class="form-group">
                      <label for="rainfall">Rainfall (mm)</label>
                      <input id="rainfall" type="number" step="0.1" class="form-control" [(ngModel)]="form.rainfall" name="rainfall" placeholder="e.g., 200" required min="0" />
                      <span class="form-hint">Average annual rainfall</span>
                    </div>
                  </div>
                </div>
              }

              <!-- Step 3: Location -->
              @if (step === 3) {
                <div class="step-content animate-fadeIn">
                  <h3>📍 Location & Season</h3>
                  <p class="step-desc">Select your state and growing season (optional but helps).</p>
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="state">State</label>
                      <select id="state" class="form-control" [(ngModel)]="form.state" name="state">
                        <option value="">Select state</option>
                        <option *ngFor="let s of states" [value]="s">{{ s }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="season">Season</label>
                      <select id="season" class="form-control" [(ngModel)]="form.season" name="season">
                        <option value="">Select season</option>
                        <option value="Kharif">Kharif (Jun-Oct)</option>
                        <option value="Rabi">Rabi (Oct-Mar)</option>
                        <option value="Summer">Summer (Mar-Jun)</option>
                        <option value="Whole Year">Whole Year</option>
                      </select>
                    </div>
                  </div>

                  <!-- Summary -->
                  <div class="summary-card">
                    <h4>📊 Input Summary</h4>
                    <div class="summary-grid">
                      <div><span>N:</span> {{ form.N }}</div>
                      <div><span>P:</span> {{ form.P }}</div>
                      <div><span>K:</span> {{ form.K }}</div>
                      <div><span>pH:</span> {{ form.ph }}</div>
                      <div><span>Temp:</span> {{ form.temperature }}°C</div>
                      <div><span>Humidity:</span> {{ form.humidity }}%</div>
                      <div><span>Rainfall:</span> {{ form.rainfall }}mm</div>
                    </div>
                  </div>
                </div>
              }

              @if (error) {
                <div class="error-message">
                  <span class="material-icons-outlined">error_outline</span> {{ error }}
                </div>
              }

              <!-- Navigation -->
              <div class="form-actions">
                @if (step > 1) {
                  <button type="button" class="btn btn-secondary" (click)="prevStep()">
                    <span class="material-icons-outlined">arrow_back</span> Previous
                  </button>
                }
                @if (step < 3) {
                  <button type="button" class="btn btn-primary" (click)="nextStep()" style="margin-left: auto;">
                    Next <span class="material-icons-outlined">arrow_forward</span>
                  </button>
                }
                @if (step === 3) {
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading" style="margin-left: auto;">
                    @if (loading) {
                      <span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>
                      Analyzing...
                    } @else {
                      <span class="material-icons-outlined">psychology</span>
                      Get Recommendation
                    }
                  </button>
                }
              </div>
            </form>
          </div>
        } @else {
          <!-- Results -->
          <div class="results-container animate-fadeInUp">
            <div class="results-header">
              <h2>🌾 Your Crop Recommendations</h2>
              <button class="btn btn-secondary" (click)="resetForm()">
                <span class="material-icons-outlined">refresh</span> New Analysis
              </button>
            </div>

            <div class="results-grid">
              @for (rec of results; track rec.crop; let i = $index) {
                <div class="result-card card" [class.top-pick]="i === 0">
                  @if (i === 0) {
                    <div class="top-badge">🏆 Top Pick</div>
                  }
                  <div class="result-icon">{{ rec.icon }}</div>
                  <h3 class="result-crop">{{ rec.crop }}</h3>

                  <div class="confidence-bar">
                    <div class="confidence-label">
                      <span>Confidence</span>
                      <span class="confidence-value">{{ rec.confidence }}%</span>
                    </div>
                    <div class="bar-bg">
                      <div class="bar-fill" [style.width.%]="rec.confidence"
                        [class.high]="rec.confidence >= 70"
                        [class.medium]="rec.confidence >= 30 && rec.confidence < 70"
                        [class.low]="rec.confidence < 30"></div>
                    </div>
                  </div>

                  <div class="result-meta">
                    <div class="meta-item">
                      <span class="material-icons-outlined">calendar_month</span>
                      {{ rec.season }}
                    </div>
                    <div class="meta-item">
                      <span class="material-icons-outlined">water_drop</span>
                      {{ rec.water_requirement }}
                    </div>
                  </div>

                  <p class="result-desc">{{ rec.description }}</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .recommend-page {
      padding: 100px 0 60px;
      min-height: 100vh;
      background: radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.05), transparent 50%);
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
      .badge { margin-bottom: 12px; }
      h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; }
      p { color: var(--text-secondary); font-size: 1.05rem; }
    }

    .form-container {
      max-width: 700px;
      margin: 0 auto;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 36px;
      backdrop-filter: blur(12px);
    }

    /* Progress Bar */
    .progress-bar { margin-bottom: 32px; }
    .progress-steps {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .progress-step {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .step-circle {
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.8rem;
      background: var(--bg-tertiary);
      color: var(--text-muted);
      transition: all 0.3s;
    }
    .progress-step.active .step-circle {
      background: var(--primary);
      color: white;
    }
    .progress-step.current .step-circle {
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
    }
    .step-text {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .progress-step.active .step-text { color: var(--text-primary); }
    .progress-track {
      height: 3px;
      background: var(--bg-tertiary);
      border-radius: 2px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 2px;
      transition: width 0.4s ease;
    }

    .step-content {
      h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
      .step-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px; }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .form-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 4px;
      display: block;
    }

    .summary-card {
      margin-top: 24px;
      padding: 20px;
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);

      h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;

      div {
        padding: 8px 12px;
        background: var(--bg-primary);
        border-radius: 6px;
        font-size: 0.85rem;

        span { color: var(--text-muted); font-size: 0.75rem; display: block; }
      }
    }

    .error-message {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; border-radius: var(--radius-sm);
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
      color: #EF4444; font-size: 0.85rem; margin-top: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    /* Results */
    .results-container { max-width: 900px; margin: 0 auto; }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;

      h2 { font-size: 1.5rem; font-weight: 800; }
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }

    .result-card {
      text-align: center;
      padding: 28px 20px;
      position: relative;
      overflow: hidden;

      &.top-pick {
        border-color: var(--primary);
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
      }
    }

    .top-badge {
      position: absolute;
      top: 12px;
      right: -28px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 36px;
      transform: rotate(45deg);
    }

    .result-icon { font-size: 2.5rem; margin-bottom: 12px; }

    .result-crop {
      font-size: 1.2rem;
      font-weight: 800;
      text-transform: capitalize;
      margin-bottom: 16px;
    }

    .confidence-bar { margin-bottom: 16px; }
    .confidence-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      margin-bottom: 6px;

      span:first-child { color: var(--text-muted); }
    }
    .confidence-value { font-weight: 700; color: var(--primary); }
    .bar-bg { height: 6px; border-radius: 3px; background: var(--bg-tertiary); }
    .bar-fill {
      height: 100%; border-radius: 3px; transition: width 1s ease;
      &.high { background: linear-gradient(90deg, var(--primary), #34D399); }
      &.medium { background: linear-gradient(90deg, var(--accent), #FBBF24); }
      &.low { background: linear-gradient(90deg, #EF4444, #F87171); }
    }

    .result-meta {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: var(--text-secondary);
      .material-icons-outlined { font-size: 16px; }
    }

    .result-desc {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
      .progress-steps { flex-direction: column; gap: 8px; }
      .step-text { display: none; }
    }
  `],
})
export class RecommendationComponent {
  step = 1;
  stepLabels = ['Soil Data', 'Weather', 'Location'];
  showResults = false;
  loading = false;
  error = '';
  results: CropRecommendation[] = [];

  form = {
    N: null as number | null, P: null as number | null, K: null as number | null,
    temperature: null as number | null, humidity: null as number | null,
    ph: null as number | null, rainfall: null as number | null,
    state: '', season: '',
  };

  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  constructor(
    private recommendationService: RecommendationService,
    private cdr: ChangeDetectorRef
  ) {}

  nextStep(): void {
    this.error = '';
    if (this.step === 1) {
      if (this.form.N == null || this.form.P == null || this.form.K == null || this.form.ph == null) {
        this.error = 'Please fill in all soil nutrient fields';
        return;
      }
    }
    if (this.step === 2) {
      if (this.form.temperature == null || this.form.humidity == null || this.form.rainfall == null) {
        this.error = 'Please fill in all weather fields';
        return;
      }
    }
    this.step++;
  }

  prevStep(): void { this.step--; this.error = ''; }

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.recommendationService.predict({
      N: this.form.N!, P: this.form.P!, K: this.form.K!,
      temperature: this.form.temperature!, humidity: this.form.humidity!,
      ph: this.form.ph!, rainfall: this.form.rainfall!,
      state: this.form.state, season: this.form.season,
    }).subscribe({
      next: (res) => {
        this.results = res.data.recommendations;
        this.showResults = true;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to get recommendation. Make sure the ML service is running.';
        this.cdr.markForCheck();
      },
    });
  }

  resetForm(): void {
    this.step = 1;
    this.showResults = false;
    this.results = [];
    this.form = { N: null, P: null, K: null, temperature: null, humidity: null, ph: null, rainfall: null, state: '', season: '' };
  }
}
