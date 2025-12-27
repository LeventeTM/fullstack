import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // You need a method in your AuthService like 'isLoggedIn()'
  // that returns true if a token exists.
  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Redirect to login if not authenticated
    return router.parseUrl('/login');
  }
};
