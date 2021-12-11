import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { ClientCLFService } from '../client-c-l-f.service';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Redirige vers la page .lignes si la commande n'est pas prête à l'envoi.
 */
export class CommandeEnvoiGardeService implements CanActivate {

    constructor(
        protected service: ClientCLFService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.service.gardeEnvoi();
    }
}
