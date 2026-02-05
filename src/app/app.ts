import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar (themeChange)="onThemeChange($event)"></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        min-height: 100vh;
      }

      .main-content {
        flex: 1;
        padding: 2rem;
        margin-left: 250px;
        transition: margin-left 0.3s;
      }

      @media (max-width: 768px) {
        .main-content {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class App {
  onThemeChange(isDark: boolean): void {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }
}
