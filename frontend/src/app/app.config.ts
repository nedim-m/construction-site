import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, LOCALE_ID } from '@angular/core'; // LOCALE_ID je sada ovdje
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { registerLocaleData } from '@angular/common';

import { QuillModule } from 'ngx-quill';
import localeBs from '@angular/common/locales/bs';



registerLocaleData(localeBs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(NgxGalleryModule),
    { provide: LOCALE_ID, useValue: 'bs' },

    importProvidersFrom(QuillModule)
 
  ]
};
