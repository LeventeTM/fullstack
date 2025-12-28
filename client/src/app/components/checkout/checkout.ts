import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';

// NG-ZORRO
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, NzTableModule, NzButtonModule, NzCardModule, NzIconModule, NzDividerModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);
  msg = inject(NzMessageService);

  // Adatok a Service-ből
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;

  isLoading = false;

  submitOrder() {
    if (this.cartItems().length === 0) {
      this.msg.error('A kosár üres!');
      return;
    }

    this.isLoading = true;

    this.orderService.placeOrder(this.cartItems()).subscribe({
      next: () => {
        this.msg.success('Rendelés sikeresen leadva!');

        this.cartService.clearCart();

        this.router.navigate(['/']);

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.msg.error('Hiba történt a rendelés során.');
        this.isLoading = false;
      }
    });
  }
}
