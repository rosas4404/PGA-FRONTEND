import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { authInterceptorProviders } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
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
