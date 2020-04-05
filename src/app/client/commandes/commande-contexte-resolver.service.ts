import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { ClientCLFService } from '../client-c-l-f.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';

@Injectable()
/**
 * Retourne le CLFDocs déjà chargé si le contexte n'a pas changé.
 * La Garde a redirigé vers la page bon
 */
export class CommandeContexteResolverService extends DataResolverService implements Resolve<CLFDocs> {

    constructor(
        private service: ClientCLFService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CLFDocs | Observable<CLFDocs> {
        return this.service.résoudContexte();
    }

}
