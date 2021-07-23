import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ClientService } from "./client.service";

@Injectable()
/**
 * Charge le stock des clients et des invitations depuis l'api sauf s'il est déjà chargé et qu'il n'y a pas d'invitations.
 * Un Component protégé par cette garde pourra lire les clients et les invitations dans le stock.
 */
export class ClientChargeEtLaissePasserGardeService implements CanActivate, CanActivateChild {

    constructor(
        private service: ClientService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.service.chargeClientsEtInvitations();
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.service.chargeClientsEtInvitations();
    }
}
