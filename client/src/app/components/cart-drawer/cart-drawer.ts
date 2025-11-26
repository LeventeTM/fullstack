import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

// NG-ZORRO
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, NzDrawerModule, NzButtonModule, NzListModule, NzIconModule, NzBadgeModule, RouterLink],
  template: `
    <nz-badge [nzCount]="totalItems()">
      <button nz-button nzType="primary" (click)="open()">
        <nz-icon nzType="shopping-cart" nzTheme="outline" />Kosár
      </button>
    </nz-badge>

    <nz-drawer
      [nzVisible]="visible"
      nzPlacement="right"
      nzTitle="Kosár tartalma"
      [nzWidth]="400"
      (nzOnClose)="close()"
    >
      <ng-container *nzDrawerContent>

        <div *ngIf="cartItems().length === 0" style="text-align: center; margin-top: 50px;">
          <span nz-icon nzType="shopping-cart" style="font-size: 30px; color: #ccc;"></span>
          <p>A kosarad üres.</p>
        </div>

        <nz-list nzItemLayout="horizontal">
          <nz-list-item
            *ngFor="let item of cartItems()"
            [nzActions]="[minusAction, plusAction, deleteAction]"
          >
            <nz-list-item-meta
              [nzAvatar]="item.image"
              [nzTitle]="item.name"
              [nzDescription]="priceTemplate"
            >
              <ng-template #priceTemplate>
                {{ item.price }} Ft x {{ item.quantity }}
                <br>
                <strong>{{ item.price * item.quantity }} Ft</strong>
              </ng-template>
            </nz-list-item-meta>

            <ng-template #minusAction>
               <a (click)="cartService.updateQuantity(item.id, -1)">
                 <span nz-icon nzType="minus">-</span>
               </a>
            </ng-template>

            <ng-template #plusAction>
               <a (click)="cartService.updateQuantity(item.id, 1)">
                 <span nz-icon nzType="plus">+</span>
               </a>
            </ng-template>

            <ng-template #deleteAction>
               <a (click)="cartService.removeFromCart(item.id)" style="color: red;">
                 <span nz-icon nzType="delete"></span>
               </a>
            </ng-template>

          </nz-list-item>
        </nz-list>

        <div class="footer" *ngIf="cartItems().length > 0" style="position: absolute; bottom: 0; width: 100%; border-top: 1px solid #e8e8e8; padding: 10px 24px; background: #fff; left: 0;">
           <h3>Összesen: {{ totalPrice() }} Ft</h3>
           <button nz-button nzType="primary" nzBlock routerLink="/checkout">Pénztár</button>
        </div>

      </ng-container>
    </nz-drawer>
  `
})
export class CartDrawer {
  cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  totalPrice = this.cartService.totalPrice;

  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
