import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Client } from './client';
import { ClientService } from './client.service';

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
        const key = KeyUidRno.keyDeTexte(route.paramMap.get('key'));
        return this.service.litClient(key);
    }

}
