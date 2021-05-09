import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from '../services/routeur.service';
import { AppPages } from '../app-pages';
import { IdEtatSite } from '../modeles/etat-site';
import { SiteService } from '../modeles/site/site.service';
import { Site } from '../modeles/site/site';
import { take, map } from 'rxjs/operators';
import { SiteRoutes, SitePages } from '../site/site-pages';
import { ClientRoutes } from '../client/client-pages';

class EtatSiteChange {

    constructor(
        protected siteService: SiteService,
    ) {
    }

    etatSiteChange(site: Site): Observable<IdEtatSite> {
        return this.siteService.litEtat(site).pipe(
            take(1),
            map(etat => {
                if (site.etat !== etat) {
                    site.etat = etat;
                    this.siteService.navigation.fixeSiteEnCours(site);
                    this.siteService.identification.fixeSiteIdentifiant(site);
                }
                return etat;
            })
        );
    }
}

@Injectable({
    providedIn: 'root',
})
/**
 * Lit dans l'Api l'état du site, fixe l'état des stockages du site et laisse passer
 */
export class EtatSiteChangeGarde extends EtatSiteChange implements CanActivate, CanActivateChild {

    constructor(
        protected siteService: SiteService,
    ) {
        super(siteService);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.siteService.navigation.litSiteEnCours();
        if (site) {
            return this.etatSiteChange(site).pipe(
                map(état => true)
            );
        }
        return true;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}

@Injectable({
    providedIn: 'root',
})
export class SiteOuvertGarde extends EtatSiteChange implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        protected siteService: SiteService,
    ) {
        super(siteService);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.siteService.navigation.litSiteEnCours();
        if (site) {
            return this.etatSiteChange(site).pipe(
                map(état => {
                    if (état !== IdEtatSite.ouvert) {
                        this.routeur.naviguePageDef(SitePages.pasOuvert, ClientRoutes, site.url);
                        return false;
                    }
                    return true;
                })
            );
        }
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
