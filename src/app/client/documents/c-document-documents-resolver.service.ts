import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CLFResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-resolver.service';
import { ClientCLFService } from '../client-c-l-f.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';

/**
 * résoud la liste des documents du site en cours
 */
@Injectable()
export class CDocumentDocumentsResolverService extends CLFResolverService implements Resolve<CLFDocs> {

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFDocs> {
        return this.documentsDuClient();
    }

}
