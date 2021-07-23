import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ApiResult403Forbidden } from '../api/api-results/api-result-403-forbidden';
import { SiteService } from '../modeles/site/site.service';

/**
 * Si l'utilisateur est identifié et s'il est client du site en cours du NavigationService, laisse passer. Sinon, redirige vers la page erreur 403.
 */
 @Injectable({
    providedIn: 'root',
})
export class ClientGarde implements CanActivate, CanActivateChild {

    constructor(
        private siteService: SiteService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.siteService.identification.estIdentifié) {
            const identifiant = this.siteService.identification.litIdentifiant();
            const site = this.siteService.navigation.litSiteEnCours();
            if (identifiant.estClient(site)) {
                return true;
            }
        }
        this.siteService.routeur.navigueVersPageErreur(new ApiResult403Forbidden());
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
