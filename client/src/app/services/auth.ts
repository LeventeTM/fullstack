import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthUser, LoginResponse } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = '/api';

  currentUser = signal<AuthUser | null>(null);

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        const userToStore: AuthUser = {
          ...response.user,
          token: response.access_token
        };
        this.currentUser.set(userToStore);
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.currentUser.set(null);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
