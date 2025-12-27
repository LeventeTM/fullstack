import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthUser, LoginResponse } from '../models/user';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = '/api';

  token = signal<string | null>(null);
  role = signal<string | null>(null);

  constructor() {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken) {
      this.token.set(storedToken);
    }
    if (storedRole) {
      this.role.set(storedRole);
    }
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        const token = response.access_token;
        const isAdmin = response.user.is_admin ? 'admin' : 'user';

        // 1. Signalok beállítása (egyszerű stringekkel)
        this.token.set(token);
        this.role.set(isAdmin);

        // 2. LocalStorage (sima stringek, nem kell JSON.stringify)
        localStorage.setItem('token', token);
        localStorage.setItem('role', isAdmin);
      })
    );
  }

  register(name: string, email: string, password: string, password_confirmation: string) {
    return this.http.post<string>(`${this.apiUrl}/register`, {name, email, password, password_confirmation})
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      finalize(() => {
        this.token.set(null);
        this.role.set(null);

        localStorage.removeItem('token');
        localStorage.removeItem('role');

        this.router.navigate(['/login']);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }
}
