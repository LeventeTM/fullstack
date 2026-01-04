import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { DataService } from '../../services/data';
import { InventoryAdminService } from '../../services/inventory-admin';
import { Item } from '../../models/item';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,

    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
  ],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.scss'],
})
export class Inventory implements OnInit {
  items = signal<Item[]>([]);
  loading = signal<boolean>(false);

  // Expose admin service to template
  constructor(private dataService: DataService, public inventoryAdmin: InventoryAdminService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);

    this.dataService.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
      },
    });
  }

  trackById(_: number, item: Item): number {
    return item.id;
  }

  // EDIT
  editItem(item: Item): void {
    this.inventoryAdmin.openEdit(item);
  }

  async submitEdit(): Promise<void> {
    const saved = await this.inventoryAdmin.submitEdit();
    if (saved) {
      this.loadItems();
    }
  }

  onEditVisibleChange(visible: boolean): void {
    if (!visible) {
      this.inventoryAdmin.closeEdit();
    }
  }

  // ADD
  openAdd(): void {
    this.inventoryAdmin.openAdd();
  }

  async submitAdd(): Promise<void> {
    const created = await this.inventoryAdmin.submitAdd();
    if (created) this.loadItems();
  }

  onAddVisibleChange(visible: boolean): void {
    if (!visible) this.inventoryAdmin.closeAdd();
  }

  async deleteItem(item: Item): Promise<void> {
    const deleted = await this.inventoryAdmin.deleteItem(item);
    if (deleted) this.loadItems();
  }
}
