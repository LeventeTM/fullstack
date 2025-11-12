import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './components/item-list/item-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ItemListComponent],
  template: `
    <main class="app-container">
      <header>
        <h1>🛒 Terméklista</h1>
      </header>

      <section>
        <app-item-list></app-item-list>
      </section>
    </main>
  `,
  styleUrls: ['./app.scss'],
})
export class App {}
