import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Menu } from './components/menu/menu';
import { Admin } from './components/admin/admin';

// NG-ZORRO
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzTypographyModule, RouterOutlet, Menu],
  template: `
    <nz-layout class="app-layout">
      <app-menu></app-menu>

      <nz-content class="app-content">
        <router-outlet></router-outlet>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ['./app.scss'],
})
export class App {}
