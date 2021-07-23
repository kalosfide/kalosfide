import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { IdEtatSite } from "../modeles/etat-site";
import { ClientCLFService } from "./client-c-l-f.service";
import { ClientPages, ClientRoutes } from "./client-pages";

/**
 * Lit dans le stock l'état du site et redirige vers la page pasOuvert si le site est fermé.
 */
 @Injectable({
    providedIn: 'root',
})
export class SiteOuvertGardeService implements CanActivate {

    constructor(
        private service: ClientCLFService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.service.navigation.litSiteEnCours();
        if (site.etat === IdEtatSite.ouvert) {
            return true;
        }
        this.service.routeur.naviguePageDef(ClientPages.pasOuvert, ClientRoutes, site.url);
        return false;
    }
}
