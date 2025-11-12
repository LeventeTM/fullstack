import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';
import { Item } from '../../models/item';
import { ItemCardComponent } from '../item-card/item-card';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.scss'],
})
export class ItemListComponent implements OnInit {
  readonly categories = ['all', 'tejtermék', 'gyümölcs', 'zöldség', 'pékáru', 'hús'];

  // state
  readonly items = signal<Item[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly selectedCategory = signal<string>('all');

  // derived
  readonly filtered = computed(() => {
    const cat = this.selectedCategory();
    const list = this.items();
    return cat === 'all' ? list : list.filter((i) => i.category === cat);
  });

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.load();
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  private load(category?: string) {
    this.loading.set(true);
    this.error.set(null);
    this.data.getItems(category).subscribe({
      next: (items) => {
        this.items.set(items ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Nem sikerült betölteni a termékeket.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
