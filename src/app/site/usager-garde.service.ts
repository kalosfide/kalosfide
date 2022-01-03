import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResult404NotFound } from '../api/api-results/api-result-404-not-found';
import { Site } from '../modeles/site/site';
import { IdentificationService } from '../securite/identification.service';
import { RouteurService } from '../services/routeur.service';

/**
 * Si l'utilisateur est identifié et si son identifiant possède le site dont l'url est le paramétre de la route, fixe
 * le role en cours de l'IdentificationService et laisse passer. Sinon, redirige vers la page erreur 404.
 * Les Resolver et Gardes suivants peuvent obtenir le role en cours par l'IdentificationService.
 */
@Injectable({
    providedIn: 'root',
})
export class UsagerGardeService implements CanActivate, CanActivateChild {

    constructor(
        private identification: IdentificationService,
        private routeur: RouteurService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const urlSite = route.paramMap.get('urlSite');
        if (urlSite) {
            const site: Site = this.identification.fixeSiteParUrl(urlSite);
            if (site) {
                return true;
            }
        }
        // navigue vers introuvable car interdit informerait de l'existence du site
        return this.routeur.urlTreeErreur(new ApiResult404NotFound());
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(childRoute, state);
    }
}
