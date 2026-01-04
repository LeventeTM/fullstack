import { Routes } from '@angular/router';
import { Checkout } from './components/checkout/checkout';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';

import { ItemListComponent } from './components/item-list/item-list';
import { Admin } from './components/admin/admin';
import { UserOrders } from './components/user-orders/user-orders';
import { Inventory } from './components/inventory/inventory';

export const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'items',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./components/item-list/item-list').then((m) => m.ItemListComponent),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/admin/admin').then((m) => m.Admin),
      },
      {
        path: 'inventory',
        canActivate: [adminGuard],
        component: Inventory,
      },
      {
        path: 'checkout',
        component: Checkout,
      },
    ],
  },
  {
    path: 'my_orders',
    canActivate: [authGuard],
    loadComponent: () => import('./components/user-orders/user-orders').then((m) => m.UserOrders),
  },

  {
    path: '**',
    redirectTo: 'items',
  },
];
