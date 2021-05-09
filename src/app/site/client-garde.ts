import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResult403Forbidden } from '../api/api-results/api-result-403-forbidden';
import { IdentificationService } from '../securite/identification.service';
import { RouteurService } from '../services/routeur.service';
import { SiteRoutes } from './site-pages';

@Injectable({
    providedIn: 'root',
})
export class ClientGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private identification: IdentificationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.identification.estIdentifié) {
            const identifiant = this.identification.litIdentifiant();
            const urlSite = SiteRoutes.urlSite(state.url);
            if (identifiant.estClientDeSiteParUrl(urlSite)) {
                return true;
            }
        }
        this.routeur.navigueVersPageErreur(new ApiResult403Forbidden());
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
