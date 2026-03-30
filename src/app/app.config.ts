import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';


import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { authInterceptorProviders } from './services/auth.interceptor';

registerLocaleData(localeEsMx);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              { provide: LOCALE_ID, useValue: 'es-MX' },
              provideHttpClient(),
              provideHttpClient(withInterceptorsFromDi()),
              authInterceptorProviders,
              provideAnimations(),
              provideToastr({
              timeOut: 3000,
              positionClass: 'toast-center-center',
              progressBar: true,
              preventDuplicates: true,
            })
  ]
};
