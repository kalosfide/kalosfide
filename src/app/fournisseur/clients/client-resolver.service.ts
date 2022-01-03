import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { Client } from '../../modeles/client/client';
import { ClientService } from '../../modeles/client/client.service';

/**
 * Résoud un client.
 * Doit être protégé par ClientChargeEtLaissePasserGardeService.
 */
 @Injectable()
export class ClientResolverService implements Resolve<Client> {

    constructor(
        private router: RouteurService,
        private service: ClientService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Client | Observable<Client> {
        const key = KeyId.keyDeTexte(route.paramMap.get('key'));
        return this.service.litClient(key);
    }

}
