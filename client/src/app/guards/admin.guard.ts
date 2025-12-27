import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (authService.isLoggedIn() && role === 'admin') {
    return true;
  } else {
    return router.parseUrl('/items');
  }
};
