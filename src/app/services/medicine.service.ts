// medicine.service.ts
// All HTTP communication with the .NET /api/medicines endpoint lives here.
// Components never call fetch() directly — they go through this service.
// This makes it easy to swap the API URL or add auth headers in one place.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine, MedicineForm } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  // One shared instance across the whole app
})
export class MedicineService {

  private readonly url = `${environment.apiUrl}/medicines`;

  constructor(private http: HttpClient) {}

  // GET /api/medicines  — fetch all, optionally filter by name
  getAll(search?: string): Observable<Medicine[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Medicine[]>(this.url, { params });
  }

  // GET /api/medicines/:id — fetch one medicine
  getById(id: string): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.url}/${id}`);
  }

  // POST /api/medicines — add a new medicine
  create(medicine: MedicineForm): Observable<Medicine> {
    return this.http.post<Medicine>(this.url, medicine);
  }

  // PUT /api/medicines/:id — update an existing medicine
  update(id: string, medicine: MedicineForm): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.url}/${id}`, medicine);
  }

  // DELETE /api/medicines/:id — remove a medicine
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
