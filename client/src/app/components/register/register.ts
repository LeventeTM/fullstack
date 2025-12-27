import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// NG-ZORRO
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzCardModule, NzIconModule],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100%; background: #f0f2f5;">
      <nz-card style="width: 400px; text-align: center;" [nzBordered]="false">
        <span nz-icon nzType="user" style="font-size: 40px; color: #1890ff; margin-bottom: 20px;"></span>
        <h2>Regisztráció</h2>

        <form nz-form [formGroup]="registerForm" (ngSubmit)="submit()">
          <nz-form-item>
            <nz-form-control>
              <nz-input-group nzPrefixIcon="mail">
                <input type="input" nz-input formControlName="name" placeholder="Name" />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>

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

          <nz-form-item>
            <nz-form-control>
              <nz-input-group nzPrefixIcon="lock">
                <input type="password" nz-input formControlName="password_confirmation" placeholder="Jelszó mégegyszer" />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>

          <button nz-button nzType="primary" nzBlock [nzLoading]="isLoading" [disabled]="registerForm.invalid">
            Belépés
          </button>
        </form>
        <div style="margin-top: 20px;">Már van fiókod? <br> <a routerLink="/login" style="cursor: pointer; color: #1890ff;">
          Bejelentkezés
        </a></div>
      </nz-card>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  msg = inject(NzMessageService);

  isLoading = false;

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password_confirmation: ['', [Validators.required]]
  });

  submit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { name, email, password, password_confirmation } = this.registerForm.value;

      this.authService.register(name!, email!, password!, password_confirmation!).subscribe({
        next: () => {
          this.msg.success('Sikeres regisztráció!');
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error(err);
          this.msg.error(err.error.message);
          this.isLoading = false;
        }
      });
    }
  }
}
