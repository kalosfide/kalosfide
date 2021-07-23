import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { ClientService } from '../client/client.service';
import { Invitation } from './invitation';

/**
 * Résoud la liste des invitations.
 * Doit être protégé par ClientChargeEtLaissePasserGardeService.
 */
 @Injectable()
export class InvitationsResolverService implements Resolve<Invitation[]> {

    constructor(
        private router: RouteurService,
        private service: ClientService,
    ) {
    }

    get routeur(): RouteurService { return this.router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Invitation[] | Observable<Invitation[]> {
        return this.service.litInvitations();
    }

}
