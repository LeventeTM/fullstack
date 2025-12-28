import { Component, inject, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { UserOrder } from '../../models/order';
import { OrderService } from '../../services/order';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-user-orders',
  imports: [
    CommonModule,
    NzCollapseModule,
    NzTableModule,
    NzTagModule,
    NzEmptyModule,
    NzSpinModule
  ],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.scss',
})
export class UserOrders implements OnInit{
  private orderService = inject(OrderService);

  orders = signal<UserOrder[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);

    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Hiba a rendelések betöltésekor:', err);
        this.isLoading.set(false);
      }
    });
  }
}
