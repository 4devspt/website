import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() themeChange = new EventEmitter<boolean>();

  isDarkTheme = false;

  navItems: NavItem[] = [
    { label: 'Home', icon: 'pi-home', route: '/home' },
    { label: 'Sua Homepage', icon: 'pi-th-large', route: '/your-homepage' },
    { label: 'Validadores / Geradores', icon: 'pi-check-square', route: '/validators-generators' },
  ];

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeChange.emit(this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');

    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  private loadThemeFromStorage(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      this.themeChange.emit(true);
      document.documentElement.classList.add('dark-theme');
    }
  }

  ngOnInit(): void {
    this.loadThemeFromStorage();
  }
}
