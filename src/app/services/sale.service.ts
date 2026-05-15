// sale.service.ts
// Handles all API calls related to sales transactions.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleRecord, SaleForm } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private readonly url = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  // GET /api/sales — load all sale records
  getAll(): Observable<SaleRecord[]> {
    return this.http.get<SaleRecord[]>(this.url);
  }

  // POST /api/sales — record a new sale and deduct stock
  create(sale: SaleForm): Observable<SaleRecord> {
    return this.http.post<SaleRecord>(this.url, sale);
  }
}
