import { Routes } from '@angular/router';
import { Checkout } from './components/checkout/checkout';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },
  { path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
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
        path: 'checkout', component: Checkout
      },
    ]
  },
  {
    path: 'my_orders',
    canActivate: [authGuard],
    loadComponent: () => import('./components/user-orders/user-orders').then((m) => m.UserOrders),
  },

  {
    path: '**',
    redirectTo: 'items'
  },
];
