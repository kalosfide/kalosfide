import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { IdentificationService } from '../securite/identification.service';

/**
 * Fixe à 0 l'id du site en cours de l'identifiant s'il existe.
 * Laisse passer.
 */
@Injectable()
export class IdentifiantRole0GardeService implements CanActivate {

    constructor(
        private identification: IdentificationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.identification.annuleSiteEnCours();
        return true;
    }

}
