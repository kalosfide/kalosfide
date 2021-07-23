import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientCLFService } from './client-c-l-f.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';

@Injectable({
    providedIn: 'root',
})
/**
 * Retourne le CLFDocs déjà chargé si le contexte n'a pas changé.
 * La Garde a redirigé vers la page bon
 */
export class ContexteCatalogueResolverService extends DataResolverService implements Resolve<CLFDocs> {

    constructor(
        private service: ClientCLFService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CLFDocs | Observable<CLFDocs> {
        return this.service.résoudContexte();
    }

}
