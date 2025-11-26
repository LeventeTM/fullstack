import { Routes } from '@angular/router';
import { Checkout } from './components/checkout/checkout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/item-list/item-list').then((m) => m.ItemListComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin').then((m) => m.Admin),
  },
  {
    path: 'checkout', component: Checkout
  },
];
