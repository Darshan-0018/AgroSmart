import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CropPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

export interface TrendData {
  state: string;
  prices: { market: string; min_price: number; max_price: number; modal_price: number; date: string }[];
}

@Injectable({ providedIn: 'root' })
export class CropPriceService {
  private apiUrl = `${environment.apiUrl}/crop-prices`;

  constructor(private http: HttpClient) {}

  search(state?: string, commodity?: string): Observable<{ success: boolean; source: string; count: number; data: CropPrice[] }> {
    let params = new HttpParams();
    if (state) params = params.set('state', state);
    if (commodity) params = params.set('commodity', commodity);
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getStates(): Observable<{ success: boolean; data: string[] }> {
    return this.http.get<any>(`${this.apiUrl}/states`);
  }

  getCommodities(): Observable<{ success: boolean; data: string[] }> {
    return this.http.get<any>(`${this.apiUrl}/commodities`);
  }

  getTrends(commodity: string, state?: string): Observable<{ success: boolean; commodity: string; data: TrendData[] }> {
    let params = new HttpParams().set('commodity', commodity);
    if (state) params = params.set('state', state);
    return this.http.get<any>(`${this.apiUrl}/trends`, { params });
  }

  compare(commodities: string[], state?: string): Observable<{ success: boolean; data: any[] }> {
    let params = new HttpParams().set('commodities', commodities.join(','));
    if (state) params = params.set('state', state);
    return this.http.get<any>(`${this.apiUrl}/compare`, { params });
  }
}
