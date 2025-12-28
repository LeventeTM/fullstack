// services/order.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart_item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  placeOrder(items: CartItem[]) {
    const orderData = {
      items: items.map(i => ({ item_id: i.id, quantity: i.quantity }))
    };

    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/myorders`);
  }
}
