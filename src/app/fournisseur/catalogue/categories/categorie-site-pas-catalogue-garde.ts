import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';
import { RouteurService } from 'src/app/services/routeur.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { CategoriePages, CategorieRoutes } from './categorie-pages';

@Injectable({
    providedIn: 'root',
})
/**
 * redirige vers l'index des catégories si le site n'est pas d'état catalogue
 */
export class CategorieSitePasCatalogueGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private navigation: NavigationService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.navigation.litSiteEnCours();
        if (site.etat !== IdEtatSite.catalogue) {
            this.routeur.naviguePageDef(CategoriePages.index, CategorieRoutes, site.nomSite);
            return false;
        }
        return true;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
