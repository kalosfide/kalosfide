import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPages } from '../app-pages';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from '../services/navigation.service';
import { RouteurService } from '../services/routeur.service';
import { SiteRoutes } from './site-pages';
import { TypesRoles } from '../securite/type-role';

@Injectable({
    providedIn: 'root',
})
export class FournisseurGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private identification: IdentificationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.identification.estIdentifié) {
            const identifiant = this.identification.litIdentifiant();
            const nomSite = SiteRoutes.nomSite(state.url);
            if (identifiant.estFournisseurDeNomSite(nomSite)) {
                return true;
            }
        }
        this.routeur.navigue([AppPages.interdit.urlSegment]);
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
