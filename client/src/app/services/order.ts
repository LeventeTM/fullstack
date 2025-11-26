// services/order.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart_item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost/api/orders';

  placeOrder(items: CartItem[], total: number) {
    // Összeállítjuk a backendnek megfelelő formátumot
    // Általában csak a product ID és a quantity kell a backendnek
    const orderData = {
      items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      totalAmount: total,
      orderDate: new Date()
    };

    return this.http.post(this.apiUrl, orderData);
  }
}
