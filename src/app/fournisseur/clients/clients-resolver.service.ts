import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Client } from 'src/app/modeles/client/client';
import { ClientService } from 'src/app/modeles/client/client.service';
import { RouteurService } from 'src/app/services/routeur.service';

/**
 * Résoud la liste des clients.
 * Doit être protégé par ClientChargeEtLaissePasserGardeService.
 */
@Injectable()
export class ClientsResolverService implements Resolve<Client[]> {

    constructor(
        private router: RouteurService,
        private service: ClientService,
    ) {
    }

    get routeur(): RouteurService { return this.router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Client[] | Observable<Client[]> {
        return this.service.litClients();
    }

}
