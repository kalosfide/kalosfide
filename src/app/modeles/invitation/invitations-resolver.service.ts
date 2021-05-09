import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { Invitation } from './invitation';
import { InvitationService } from './invitation.service';
import { DataResolverService } from '../../services/data-resolver.service';

/**
 * résoud la liste des invitations du site en cours
 */
@Injectable()
export class InvitationsResolverService implements Resolve<Invitation[]> {

    constructor(
        private router: RouteurService,
        private service: InvitationService,
    ) {
    }

    get routeur(): RouteurService { return this.router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Invitation[]> {
        return this.service.invitations$();
    }

}
