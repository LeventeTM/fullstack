import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Item } from '../../models/item';

// NG-ZORRO
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NzCardModule, NzImageModule, NzTagModule],
  templateUrl: './item-card.html',
  styleUrls: ['./item-card.scss'],
})
export class ItemCardComponent {
  @Input({ required: true }) item!: Item;
}
