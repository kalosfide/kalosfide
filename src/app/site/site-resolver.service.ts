import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { Site } from '../modeles/site/site';
import { tap } from 'rxjs/operators';
import { SiteService } from '../modeles/site/site.service';
import { NavigationService } from '../services/navigation.service';


@Injectable()
export class SiteResolverService implements Resolve<Site> {

    constructor(
        private _siteService: SiteService,
        private _navigation: NavigationService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Site> {
        const nomSite = route.paramMap.get('nomSite');
        if (!nomSite) {
            return EMPTY;
        }
        return this._siteService.trouveParNom(nomSite).pipe(
            tap(site => this._navigation.fixeSiteEnCours(site))
        );
    }

}
