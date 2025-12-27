import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Ha van token a Signalban VAGY a localStorage-ban
  const hasToken = authService.isLoggedIn() || !!localStorage.getItem('token');

  if (hasToken) {
    // Ha be van jelentkezve, ne engedjük a loginra, küldjük az items-re
    return router.createUrlTree(['/items']);
  }

  // Ha nincs bejelentkezve, mehet a login oldalra
  return true;
};
