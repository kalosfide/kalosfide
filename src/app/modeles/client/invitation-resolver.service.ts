import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientService } from '../client/client.service';
import { Invitation } from './invitation';

/**
 * Résoud une invitation.
 * Doit être protégé par ClientChargeEtLaissePasserGardeService.
 */
@Injectable()
export class InvitationResolverService implements Resolve<Invitation> {

    constructor(
        private service: ClientService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Invitation | Observable<Invitation> {
        const email = route.paramMap.get('key')
        return this.service.litInvitation(email);
    }

}
