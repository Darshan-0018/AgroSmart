import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Recommendation {
  _id: string;
  userId: string;
  inputs: {
    N: number; P: number; K: number;
    temperature: number; humidity: number;
    ph: number; rainfall: number;
    state: string; season: string;
  };
  prediction: string;
  recommendations: CropRecommendation[];
  createdAt: string;
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
  season: string;
  water_requirement: string;
  icon: string;
  description: string;
}

export interface PredictInput {
  N: number; P: number; K: number;
  temperature: number; humidity: number;
  ph: number; rainfall: number;
  state: string; season: string;
}

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private apiUrl = `${environment.apiUrl}/recommendations`;

  constructor(private http: HttpClient) {}

  predict(data: PredictInput): Observable<{ success: boolean; data: Recommendation }> {
    return this.http.post<{ success: boolean; data: Recommendation }>(`${this.apiUrl}/predict`, data);
  }

  getHistory(page = 1, limit = 10): Observable<{
    success: boolean;
    data: Recommendation[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any>(`${this.apiUrl}/history`, { params });
  }

  getStats(): Observable<{
    success: boolean;
    data: {
      totalRecommendations: number;
      cropDistribution: { _id: string; count: number }[];
      recentRecommendations: Recommendation[];
    };
  }> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  deleteRecommendation(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}
