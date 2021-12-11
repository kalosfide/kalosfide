import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Fabrique } from "../disposition/fabrique/fabrique";
import { IdentificationService } from "../securite/identification.service";
import { RouteurService } from "../services/routeur.service";

/**
 * Si l'utilisateur est identifié et s'il est client du site en cours du NavigationService, laisse passer. Sinon, redirige vers la page erreur 403.
 */
 @Injectable({
    providedIn: 'root',
})
export class AdminGardeService implements CanActivate {

    constructor(
        private identification: IdentificationService,
        private routeur: RouteurService,
    ) {
    }

    canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const identifiant = this.identification.litIdentifiant();
        if (identifiant.estAdministrateur) {
            return true;
        }
        return this.routeur.urlTreeUrlDef({ routeur: Fabrique.url.appRouteur.appSite });
    }
}
