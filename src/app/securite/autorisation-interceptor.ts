import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentificationService } from './identification.service';
import { tap, finalize } from 'rxjs/operators';
import { ApiIdentifiant, Identifiant } from './identifiant';

@Injectable()
export class AutorisationInterceptor implements HttpInterceptor {

    constructor(
        private identification: IdentificationService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let reqAutorisée = req;
        // ajoute le header du jeton
        if (this.identification.estIdentifié) {
            const jwt = this.identification.jeton;
            reqAutorisée = req.clone({ setHeaders: { Authorization: 'Bearer ' + jwt } });
        }

        let response: HttpResponse<any>;
        let ok = false;

        // passe au suivant
        return next.handle(reqAutorisée)
            .pipe(
                tap((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.DownloadProgress:
                            console.log('DownloadProgress', reqAutorisée, reqAutorisée.headers.keys());
                            break;
                        case HttpEventType.Response:
                            response = event as HttpResponse<any>;
                            ok = true; // instanceof HttpResponse;
//                            console.log('Response0', response, response.headers.keys());
                            break;
                        case HttpEventType.ResponseHeader:
                            console.log('ResponseHeader', reqAutorisée, reqAutorisée.headers.keys());
                            break;
                        case HttpEventType.Sent:
//                            console.log('Sent', req_autorisée, req_autorisée.headers.keys());
                            break;
                        case HttpEventType.UploadProgress:
                            console.log('UploadProgress', reqAutorisée, reqAutorisée.headers.keys());
                            break;
                        case HttpEventType.User:
                            console.log('User', reqAutorisée, reqAutorisée.headers.keys());
                            break;
                        default:
                            break;
                    }
                }),
                finalize(() => {
                    if (response) {
//                        console.log('Response', response, response.headers.keys());
                        const jwtIdentifiantSérialisé = response.headers.get('jwtbearer');
                        if (jwtIdentifiantSérialisé) {
                            const identifiant: ApiIdentifiant = response.body as ApiIdentifiant;
                            this.identification.fixeIdentifiants(jwtIdentifiantSérialisé, identifiant);
                        }
                    }
                })
            );
    }
}
