import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// ...

// NG-ZORRO
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { CategoryService } from '../../services/category';
import { CartDrawer } from "../cart-drawer/cart-drawer";
import { ItemCardComponent } from "../item-card/item-card";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    CartDrawer,
    ItemCardComponent
],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
})
export class Menu implements OnInit {
products: any;
  constructor(public readonly categoryService: CategoryService, private readonly router: Router) {}

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

  onCategorySelect(category: string): void {
    this.categoryService.setSelected(category);
    this.router.navigate(['/']);
  }
}
