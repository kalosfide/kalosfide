import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Fabrique } from "../disposition/fabrique/fabrique";
import { IdentificationService } from "../securite/identification.service";
import { RouteurService } from "../services/routeur.service";
import { ClientPages } from "./client-pages";

/**
 * Lit dans le stock l'état du site et redirige vers la page accueil si le site n'est pas fermé
 */
 @Injectable({
    providedIn: 'root',
})
export class SitePasOuvertGardeService implements CanActivate {

    constructor(
        private identification: IdentificationService,
        private routeur: RouteurService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const site = this.identification.siteEnCours;
        if (!site.ouvert) {
            return true;
        }
        return this.routeur.urlTreePageDef(ClientPages.accueil, Fabrique.url.appRouteur.client);
    }
}
