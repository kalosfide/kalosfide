import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';

/**
 * Résoud la liste des documents d'un client en la demandant à l'api.
 * Redirige vers la page NotFound si le client n'existe pas, vers la page clients si le client n'a pas de documents.
 */
@Injectable()
export class FDocumentDocumentsResolverService implements Resolve<CLFDocs> {

    constructor(
        private service: FournisseurCLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CLFDocs | Observable<CLFDocs> {
        const clfDocs = this.service.litStockSiExistant();
        if (!clfDocs) {
            throw new Error('FDocumentDocumentsResolverService: La garde précédente doit avoir déjà résolu le clfDocs');
        }
        return clfDocs;
    }
}
