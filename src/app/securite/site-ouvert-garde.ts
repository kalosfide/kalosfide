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
export class EtatSiteChangeGarde extends EtatSiteChange implements CanActivate, CanActivateChild {

    constructor(
        protected siteService: SiteService,
    ) {
        super(siteService);
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
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

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.siteService.navigation.litSiteEnCours();
        if (site) {
            return this.etatSiteChange(site).pipe(
                map(état => {
                    if (état !== IdEtatSite.ouvert) {
                        this.routeur.navigue([AppPages.pasOuvert.urlSegment]);
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
