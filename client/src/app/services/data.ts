import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly api = '/api';

  constructor(private http: HttpClient) {}

  getItems(category?: string): Observable<Item[]> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    // If your Laravel ItemController uses pagination (paginate()),
    // it returns {data: Item[], ...meta}. Map to the array.
    return this.http
      .get<any>(`${this.api}/items`, { params })
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }
}
