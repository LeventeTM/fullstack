import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataService } from '../../services/data';
import { CategoryService } from '../../services/category';
import { Item } from '../../models/item';
import { ItemCardComponent } from '../item-card/item-card';

// NG-ZORRO
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NzSpinModule,
    NzAlertModule,
    NzEmptyModule,
    NzGridModule,
    ItemCardComponent,
  ],
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.scss'],
})
export class ItemListComponent implements OnInit {
  readonly items = signal<Item[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly data: DataService,
    public readonly categoryService: CategoryService
  ) {
    effect(() => {
      const category = this.categoryService.selected();
      this.loadItems(category);
    });
  }

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

  get categories(): string[] {
    return this.categoryService.categories();
  }

  setCategory(category: string): void {
    this.categoryService.setSelected(category);
  }

  filtered(): Item[] {
    return this.items();
  }

  private loadItems(category: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.data.getItems(category).subscribe({
      next: (items) => {
        this.items.set(items ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('getItems error', err);
        this.error.set('Nem sikerült betölteni a termékeket.');
        this.loading.set(false);
      },
    });
  }
}
