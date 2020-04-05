import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentificationService } from './identification.service';
import { tap, finalize } from 'rxjs/operators';
import { Identifiant } from './identifiant';

@Injectable()
export class AutorisationInterceptor implements HttpInterceptor {

    constructor(
        private identification: IdentificationService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let ok = false;

        let req_autorisée = req;
        // ajoute le header du jeton
        if (this.identification.estIdentifié) {
            const jwt = this.identification.jeton;
            req_autorisée = req.clone({ setHeaders: { Authorization: 'Bearer ' + jwt } });
        }

        let response: HttpResponse<any>;

        // passe au suivant
        return next.handle(req_autorisée)
            .pipe(
                tap((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.DownloadProgress:
                            console.log('DownloadProgress', req_autorisée, req_autorisée.headers.keys());
                            break;
                        case HttpEventType.Response:
                            response = event as HttpResponse<any>;
//                            console.log('Response0', response, response.headers.keys());
                            break;
                        case HttpEventType.ResponseHeader:
                            console.log('ResponseHeader', req_autorisée, req_autorisée.headers.keys());
                            break;
                        case HttpEventType.Sent:
//                            console.log('Sent', req_autorisée, req_autorisée.headers.keys());
                            break;
                        case HttpEventType.UploadProgress:
                            console.log('UploadProgress', req_autorisée, req_autorisée.headers.keys());
                            break;
                        case HttpEventType.User:
                            console.log('User', req_autorisée, req_autorisée.headers.keys());
                            break;
                        default:
                            break;
                    }
                    ok = event.type === HttpEventType.Response; // instanceof HttpResponse;
                }),
                finalize(() => {
                    if (response) {
//                        console.log('Response', response, response.headers.keys());
                        const jwtIdentifiantSérialisé = response.headers.get('jwtbearer');
                        if (jwtIdentifiantSérialisé) {
                            const identifiant: Identifiant = response.body as Identifiant;
                            this.identification.fixeIdentifiants(jwtIdentifiantSérialisé, identifiant);
                        }
                    }
                })
            );
    }
}
