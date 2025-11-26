import { Routes } from '@angular/router';

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
];
