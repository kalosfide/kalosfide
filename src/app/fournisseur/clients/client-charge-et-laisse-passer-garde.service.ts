import { Injectable } from "@angular/core";
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ClientService } from "src/app/modeles/client/client.service";

@Injectable()
/**
 * Charge le stock des clients et des invitations depuis l'api sauf s'il est déjà chargé et qu'il n'y a pas d'invitations.
 * Un Component protégé par cette garde pourra lire les clients et les invitations dans le stock.
 */
export class ClientChargeEtLaissePasserGardeService implements CanActivateChild {

    constructor(
        private service: ClientService,
    ) {
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.service.chargeClientsEtInvitations();
    }
}
