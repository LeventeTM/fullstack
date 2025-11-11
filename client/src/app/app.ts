import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { AuthService } from './core/auth'; // ✅ use your existing file path

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <button (click)="login()">Login</button>
    <button (click)="me()">Me</button>
    <button (click)="projects()">Projects</button>
    <button (click)="logout()">Logout</button>
    <pre>{{ data | json }}</pre>
  `,
})
export class App {
  data: any;

  constructor(private auth: AuthService) {}

  login() {
    this.auth.csrf().subscribe(() => {
      this.auth.login('user@example.com', 'password').subscribe((res) => (this.data = res));
    });
  }

  me() {
    this.auth.me().subscribe((res) => (this.data = res));
  }

  projects() {
    this.auth.projects().subscribe((res) => (this.data = res));
  }

  logout() {
    this.auth.logout().subscribe((res) => (this.data = res));
  }
}
