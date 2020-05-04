import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteurService } from 'src/app/services/routeur.service';
import { SiteService } from '../site/site.service';
import { Observable } from 'rxjs';
import { IdEtatSite } from '../etat-site';
import { SitePages } from 'src/app/site/site-pages';

@Injectable({
    providedIn: 'root',
})
export class VCEtatCatalogueGardeService implements CanActivate {

    constructor(
        private routeur: RouteurService,
        protected siteService: SiteService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.siteService.navigation.litSiteEnCours();
        if (site) {
            if (site.etat !== IdEtatSite.catalogue) {
                this.routeur.navigueRelatif(state, '../' + SitePages.catalogue.urlSegment);
                return false;
            }
            return true;
        }
        return false;
    }
}

