import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/'; // dev proxy routes this to Laravel
  constructor(private http: HttpClient) {}

  csrf() {
    return this.http.get(this.base + 'sanctum/csrf-cookie');
  }

  login(email: string, password: string) {
    return this.http.post(this.base + 'api/login', { email, password });
  }

  me() {
    return this.http.get(this.base + 'api/me');
  }

  projects() {
    return this.http.get(this.base + 'api/projects');
  }

  logout() {
    return this.http.post(this.base + 'api/logout', {});
  }
}
