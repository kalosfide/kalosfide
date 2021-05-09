import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Client } from './client';
import { ClientService } from './client.service';
import { DataResolverService } from '../../services/data-resolver.service';

@Injectable()
export class ClientResolverService implements Resolve<Client> {

    constructor(
        private router: RouteurService,
        private service: ClientService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Client> {
        const key = KeyUidRno.keyDeTexte(route.paramMap.get('key'));
        return this.service.client$(key);
    }

}

@Injectable()
export class ClientRésoluResolverService extends DataResolverService implements Resolve<Client> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client | Observable<Client> {
        const résolu: Client = this.résolu(route, 'client');
        if (résolu) {
            return résolu;
        } else {
            throw new Error('ClientRésoluResolverService: ClientResolverService doit avoir déjà résolu le client');
        }
    }

}
