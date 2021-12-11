import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientCLFService } from '../client-c-l-f.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';

/**
 * Résoud la liste des documents du client en la demandant à l'api.
 */
@Injectable()
export class CDocumentDocumentsResolverService implements Resolve<CLFDocs> {

    constructor(
        protected service: ClientCLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFDocs> {
        return this.service.clientAvecRésumésDocs();
    }

}
