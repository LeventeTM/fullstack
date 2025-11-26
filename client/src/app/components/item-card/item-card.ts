import { Component, Input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Item } from '../../models/item';
import { CartService } from '../../services/cart';

// NG-ZORRO
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NzCardModule, NzImageModule, NzTagModule, NzButtonModule, NzIconModule],
  templateUrl: './item-card.html',
  styleUrls: ['./item-card.scss'],
})
export class ItemCardComponent {
  @Input({ required: true }) item!: Item;

  private cartService = inject(CartService);

  addItem() {
    this.cartService.addToCart(this.item);
  }
}
