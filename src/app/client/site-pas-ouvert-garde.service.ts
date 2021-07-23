import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { IdEtatSite } from "../modeles/etat-site";
import { SiteService } from "../modeles/site/site.service";
import { ClientPages, ClientRoutes } from "./client-pages";

/**
 * Lit dans le stock l'état du site et redirige vers la page accueil si le site n'est pas fermé
 */
 @Injectable({
    providedIn: 'root',
})
export class SitePasOuvertGardeService implements CanActivate {

    constructor(
        private service: SiteService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.service.navigation.litSiteEnCours();
        if (site.etat === IdEtatSite.catalogue) {
            return true;
        }
        this.service.routeur.naviguePageDef(ClientPages.accueil, ClientRoutes, site.url);
        return false;
    }
}
