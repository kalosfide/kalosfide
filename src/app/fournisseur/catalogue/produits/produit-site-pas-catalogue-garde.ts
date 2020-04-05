import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProduitRoutes, ProduitPages } from './produit-pages';
import { NavigationService } from 'src/app/services/navigation.service';
import { RouteurService } from '../../../services/routeur.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';

@Injectable({
    providedIn: 'root',
})
/**
 * redirige vers l'index des produits si le site n'est pas d'état catalogue
 */
export class ProduitSitePasCatalogueGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private navigation: NavigationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.navigation.litSiteEnCours();
        if (site.etat !== IdEtatSite.catalogue) {
            this.routeur.naviguePageDef(ProduitPages.index, ProduitRoutes, site.nomSite);
            return false;
        }
        return true;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
