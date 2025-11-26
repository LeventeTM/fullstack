import { Injectable, signal } from '@angular/core';
import { DataService } from './data';
import { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  readonly categories = signal<string[]>(['minden']);
  readonly selected = signal<string>('minden');

  private loaded = false;

  constructor(private readonly data: DataService) {}

  loadCategories(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.data.getItems().subscribe({
      next: (items: Item[]) => {
        const unique = Array.from(new Set(items.map((i) => i.category).filter(Boolean))).sort();

        this.categories.set(['minden', ...unique]);
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  setSelected(category: string): void {
    this.selected.set(category);
  }
}
