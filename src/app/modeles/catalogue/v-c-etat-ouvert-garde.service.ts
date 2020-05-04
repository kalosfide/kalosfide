import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteurService } from 'src/app/services/routeur.service';
import { SiteService } from '../site/site.service';
import { Observable } from 'rxjs';
import { IdEtatSite } from '../etat-site';
import { SitePages } from 'src/app/site/site-pages';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class VCEtatOuvertGardeService implements CanActivate {

    constructor(
        private routeur: RouteurService,
        protected siteService: SiteService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.siteService.vérifieEtat().pipe(
            map(état => {
                if (état !== IdEtatSite.ouvert) {
                    this.routeur.navigueRelatif(state, '../' + SitePages.pasOuvert.urlSegment);
                    return false;
                }
                return true;
            })
        );
    }
}

