import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly api = '/api';

  constructor(private http: HttpClient) {}

  getItems(category?: string): Observable<Item[]> {
    let params = new HttpParams();

    if (category && category !== 'minden') {
      params = params.set('category', category);
    }

    return this.http.get<Item[]>(`${this.api}/items`, { params });
  }
}
