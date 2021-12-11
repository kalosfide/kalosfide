import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFClientBilanDocs } from 'src/app/modeles/c-l-f/c-l-f-bilan-docs';

/**
 * Retourne la liste par client des bilans (nombre et total des montants) des documents par type.
 */
@Injectable()
export class FDocumentClientsResolverService implements Resolve<CLFClientBilanDocs[]> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFClientBilanDocs[]> {
        return this.service.clientsAvecBilanDocs();
    }

}
