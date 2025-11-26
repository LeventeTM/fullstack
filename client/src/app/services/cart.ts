import { Injectable, signal, computed } from '@angular/core';
import { Item } from '../models/item';
import { CartItem } from '../models/cart_item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  addToCart(product: Item) {
    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...items, { ...product, quantity: 1 }];
      }
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update((items) => items.filter((item) => item.id !== productId));
  }

  updateQuantity(productId: number, change: number) {
    this.cartItems.update((items) =>
      items.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  }

  clearCart() { this.cartItems.set([]); }
}
