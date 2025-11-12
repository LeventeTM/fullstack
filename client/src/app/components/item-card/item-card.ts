import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Item } from '../../models/item';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './item-card.html',
  styleUrls: ['./item-card.scss'],
})
export class ItemCardComponent {
  @Input({ required: true }) item!: Item;
}
