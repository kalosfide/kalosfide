import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPages } from '../app-pages';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from '../services/navigation.service';
import { RouteurService } from '../services/routeur.service';
import { SiteRoutes } from './site-pages';

@Injectable({
    providedIn: 'root',
})
export class UsagerGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private identification: IdentificationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.identification.estIdentifié) {
            const identifiant = this.identification.litIdentifiant();
            const urlSite = SiteRoutes.urlSite(state.url);
            if (identifiant.estUsagerDeSiteParUrl(urlSite)) {
                return true;
            }
        }
        // navigue vers introuvable car interdit informerait de l'existence du site
        this.routeur.navigue([AppPages.introuvable.urlSegment]);
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
