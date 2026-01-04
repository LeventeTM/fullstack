import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { DataService } from './data';
import { CategoryService } from './category';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class InventoryAdminService {
  // EDIT modal state
  isEditVisible = signal<boolean>(false);
  isSavingEdit = signal<boolean>(false);
  editForm!: FormGroup;
  editingItemId = signal<number | null>(null);

  // ADD modal state
  isAddVisible = signal<boolean>(false);
  isSavingAdd = signal<boolean>(false);
  addForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private dataService: DataService,
    private categoryService: CategoryService
  ) {
    this.buildForms();
  }

  // Shared validation rules
  private buildItemForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      category: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      weight: [null, [Validators.required, Validators.min(0)]],
      image: ['', [Validators.required, Validators.maxLength(500)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]],
    });
  }

  private buildForms(): void {
    this.editForm = this.buildItemForm();
    this.addForm = this.buildItemForm();
  }

  // Categories for nz-select (exclude UI-only "minden")
  get categories(): string[] {
    return this.categoryService.categories().filter((c) => c !== 'minden');
  }

  // EDIT
  openEdit(item: Item): void {
    this.editingItemId.set(item.id);

    this.editForm.reset({
      name: item.name ?? '',
      category: item.category ?? '',
      price: item.price ?? 0,
      stock: item.stock ?? 0,
      weight: item.weight ?? 0,
      image: item.image ?? '',
      description: item.description ?? '',
    });

    this.isEditVisible.set(true);
  }

  closeEdit(): void {
    if (this.isSavingEdit()) return;

    this.isEditVisible.set(false);
    this.editingItemId.set(null);
    this.editForm.markAsPristine();
  }

  get editImagePreview(): string {
    const val = this.editForm?.get('image')?.value;
    return typeof val === 'string' ? val : '';
  }

  async submitEdit(): Promise<boolean> {
    this.editForm.markAllAsTouched();

    if (this.editForm.invalid) {
      this.message.error('Kérlek, javítsd a hibás mezőket.');
      return false;
    }

    const itemId = this.editingItemId();
    if (!itemId) return false;

    const payload: Partial<Item> = {
      name: String(this.editForm.value.name).trim(),
      category: String(this.editForm.value.category).trim(),
      price: Number(this.editForm.value.price),
      stock: Number(this.editForm.value.stock),
      weight: Number(this.editForm.value.weight),
      image: String(this.editForm.value.image).trim(),
      description: String(this.editForm.value.description).trim(),
    };

    return new Promise<boolean>((resolve) => {
      this.modal.confirm({
        nzTitle: 'Mentés megerősítése',
        nzContent: 'Biztosan elmented a módosításokat ehhez a termékhez?',
        nzOkText: 'Igen, mentés',
        nzCancelText: 'Mégse',
        nzOnOk: async () => {
          this.isSavingEdit.set(true);

          try {
            await firstValueFrom(this.dataService.updateItem(itemId, payload));
            this.message.success('Termék frissítve.');
            this.isEditVisible.set(false);
            this.editingItemId.set(null);
            resolve(true);
          } catch {
            this.message.error('Nem sikerült frissíteni a terméket.');
            resolve(false);
          } finally {
            this.isSavingEdit.set(false);
          }
        },
        nzOnCancel: () => resolve(false),
      });
    });
  }

  // ADD
  openAdd(): void {
    this.categoryService.loadCategories();

    this.addForm.reset({
      name: '',
      category: '',
      price: null,
      stock: null,
      weight: null,
      image: '',
      description: '',
    });

    this.isAddVisible.set(true);
  }

  closeAdd(): void {
    if (this.isSavingAdd()) return;

    this.isAddVisible.set(false);
    this.addForm.markAsPristine();
  }

  get addImagePreview(): string {
    const val = this.addForm?.get('image')?.value;
    return typeof val === 'string' ? val : '';
  }

  async submitAdd(): Promise<boolean> {
    this.addForm.markAllAsTouched();

    if (this.addForm.invalid) {
      this.message.error('Kérlek, javítsd a hibás mezőket.');
      return false;
    }

    const payload: Partial<Item> = {
      name: String(this.addForm.value.name).trim(),
      category: String(this.addForm.value.category).trim(),
      price: Number(this.addForm.value.price),
      stock: Number(this.addForm.value.stock),
      weight: Number(this.addForm.value.weight),
      image: String(this.addForm.value.image).trim(),
      description: String(this.addForm.value.description).trim(),
    };

    return new Promise<boolean>((resolve) => {
      this.modal.confirm({
        nzTitle: 'Hozzáadás megerősítése',
        nzContent: 'Biztosan hozzáadod ezt a terméket?',
        nzOkText: 'Igen, hozzáadás',
        nzCancelText: 'Mégse',
        nzOnOk: async () => {
          this.isSavingAdd.set(true);

          try {
            await firstValueFrom(this.dataService.createItem(payload));
            this.message.success('Termék hozzáadva.');
            this.isAddVisible.set(false);
            resolve(true);
          } catch {
            this.message.error('Nem sikerült hozzáadni a terméket.');
            resolve(false);
          } finally {
            this.isSavingAdd.set(false);
          }
        },
        nzOnCancel: () => resolve(false),
      });
    });
  }

  // DELETE
  async deleteItem(item: Item): Promise<boolean> {
    // Safety: prevent accidental deletes and warn about historical orders
    const name = item?.name ? ` („${item.name}”)` : '';

    return new Promise<boolean>((resolve) => {
      this.modal.confirm({
        nzTitle: `Termék törlése${name}`,
        nzContent:
          'Biztosan törölni szeretnéd ezt a terméket? Ha a termék korábbi rendelésben szerepel, a törlés csak archiválásként (soft delete) történik, így a rendelési előzmények nem sérülnek.',
        nzOkText: 'Igen, törlés',
        nzCancelText: 'Mégse',
        nzOkDanger: true,
        nzOnOk: async () => {
          try {
            await firstValueFrom(this.dataService.deleteItem(item.id));
            this.message.success('Termék törölve.');
            resolve(true);
          } catch (e: any) {
            const status = e?.status;

            if (status === 401) this.message.error('Lejárt a bejelentkezés. Jelentkezz be újra.');
            else if (status === 403) this.message.error('Nincs jogosultságod ehhez a művelethez.');
            else if (status === 404)
              this.message.error('A termék nem található (lehet már törölt).');
            else this.message.error('Nem sikerült törölni a terméket.');

            resolve(false);
          }
        },
        nzOnCancel: () => resolve(false),
      });
    });
  }
}
