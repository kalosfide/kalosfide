import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { Client } from 'src/app/modeles/client/client';
import { FDocumentResolverService } from './f-document-resolver.service';

/**
 * Résoud la liste des documents d'un client en la demandant à l'api.
 * Redirige vers la page NotFound si le client n'existe pas, vers la page clients si le client n'a pas de documents.
 */
@Injectable()
export class FDocumentClientResolverService extends FDocumentResolverService implements Resolve<Client> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client | Observable<Client> {
        return this.client();
    }
}
