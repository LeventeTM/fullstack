import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// NG-ZORRO
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzCardModule, NzIconModule],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5;">
      <nz-card style="width: 400px; text-align: center;" [nzBordered]="false">
        <span nz-icon nzType="user" style="font-size: 40px; color: #1890ff; margin-bottom: 20px;"></span>
        <h2>Bejelentkezés</h2>

        <form nz-form [formGroup]="loginForm" (ngSubmit)="submit()">
          <nz-form-item>
            <nz-form-control>
              <nz-input-group nzPrefixIcon="mail">
                <input type="email" nz-input formControlName="email" placeholder="Email cím" />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control>
              <nz-input-group nzPrefixIcon="lock">
                <input type="password" nz-input formControlName="password" placeholder="Jelszó" />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>

          <button nz-button nzType="primary" nzBlock [nzLoading]="isLoading" [disabled]="loginForm.invalid">
            Belépés
          </button>
        </form>
      </nz-card>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  msg = inject(NzMessageService);

  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.msg.success('Sikeres bejelentkezés');
          this.isLoading = false;
          // Frontend routing: átirányítunk a főoldalra
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          this.msg.error('Hibás adatok');
          this.isLoading = false;
        }
      });
    }
  }
}
