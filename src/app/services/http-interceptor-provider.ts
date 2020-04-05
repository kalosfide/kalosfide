import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AutorisationInterceptor } from '../securite/autorisation-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AutorisationInterceptor, multi: true },
];
