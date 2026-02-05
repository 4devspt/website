import { bootstrapApplication } from '@angular/platform-browser';
import Lara from '@primeuix/themes/lara';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { providePrimeNG } from 'primeng/config';

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
  ],
}).catch((err) => console.error(err));
