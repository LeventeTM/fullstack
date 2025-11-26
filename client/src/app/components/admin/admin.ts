import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzPaginationModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class Admin {
  orders = signal<any[]>([]);
  total = signal<number>(0);
  pageIndex = signal<number>(1);
  pageSize = signal<number>(5); // will sync from API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    const params = new HttpParams().set('page', this.pageIndex().toString());

    this.http.get<any>('/api/orders', { params }).subscribe({
      next: (res) => {
        this.orders.set(res.data ?? []);
        this.total.set(res.total ?? 0);
        this.pageIndex.set(res.current_page ?? 1);
        this.pageSize.set(res.per_page ?? 5);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.fetchOrders();
  }

  getTotalQty(order: any): number {
    if (!order.items) return 0;
    return order.items.reduce((sum: number, item: any) => sum + (item?.pivot?.quantity ?? 0), 0);
  }

  getTotalAmount(order: any): number {
    if (!order.items) return 0;
    return order.items.reduce(
      (sum: number, item: any) => sum + (item?.pivot?.quantity ?? 0) * (item?.pivot?.price ?? 0),
      0
    );
  }
}
