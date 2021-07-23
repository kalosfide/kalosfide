import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResult404NotFound } from '../api/api-results/api-result-404-not-found';
import { SiteService } from '../modeles/site/site.service';

/**
 * Si l'utilisateur est identifié et si son identifiant possède le site dont l'url est le paramétre de la route, fixe
 * le site en cours du NavigationService et laisse passer. Sinon, redirige vers la page erreur 404.
 * Les Resolver et Gardes suivants peuvent obtenir le site par le NavigationService.
 */
 @Injectable({
    providedIn: 'root',
})
export class UsagerGarde implements CanActivate, CanActivateChild {

    constructor(
        private siteService: SiteService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const urlSite = route.paramMap.get('urlSite');
        if (urlSite) {
            const identifiant = this.siteService.identification.litIdentifiant();
            if (identifiant) {
                const site = identifiant.sites.find(s => s.url === urlSite);
                if (site) {
                    this.siteService.navigation.fixeSiteEnCours(site);
                    return true;
                }
            }
        }
        // navigue vers introuvable car interdit informerait de l'existence du site
            this.siteService.routeur.navigueVersPageErreur(new ApiResult404NotFound());
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
