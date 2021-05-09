import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../modeles/site/site';
import { SiteService } from '../modeles/site/site.service';
import { ApiResult401Unauthorized } from '../api/api-results/api-result-401-unauthorized';
import { ApiResult404NotFound } from '../api/api-results/api-result-404-not-found';
import { AppPages } from '../app-pages';
import { AppSiteRoutes } from '../app-site/app-site-pages';
import { ComptePages } from '../compte/compte-pages';


@Injectable()
export class SiteResolverService implements Resolve<Site> {

    constructor(
        private siteService: SiteService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Site | Observable<Site> {
        const urlSite = route.paramMap.get('urlSite');
        if (!urlSite) {
            this.siteService.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return null;
        }
        const identifiant = this.siteService.identification.litIdentifiant();
        if (!identifiant) {
            this.siteService.routeur.navigate([AppSiteRoutes.url([AppPages.compte.urlSegment, ComptePages.connection.urlSegment])]);
            return null;
        }
        const site = identifiant.sites.find(s => s.url === urlSite);
        if (!site) {
            this.siteService.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return null;
        }
        this.siteService.navigation.fixeSiteEnCours(site);
        return site;
    }

}
