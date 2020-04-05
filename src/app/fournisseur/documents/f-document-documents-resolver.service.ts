import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CLFResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-resolver.service';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';

/**
 * résoud la liste des documents du site en cours
 */
@Injectable()
export class FDocumentDocumentsResolverService extends CLFResolverService implements Resolve<CLFDoc[]> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFDoc[]> {
        return this.documentsDuSite();
    }

}
