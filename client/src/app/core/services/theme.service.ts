import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(true);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const isDark = !this.isDarkTheme.value;
      this.isDarkTheme.next(isDark);
      this.applyTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      this.isDarkTheme.next(isDark);
      this.applyTheme(isDark);
    } else {
      // Default to dark theme or check system preference
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const isDark = !prefersLight;
      this.isDarkTheme.next(isDark);
      this.applyTheme(isDark);
    }
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}
