import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from './navigation.service';
import { Site } from '../modeles/site/site';
import { SiteRoutes, ISiteRoutes } from '../site/site-pages';
import { AppSiteRoutes } from '../app-site/app-site-pages';
import { PageDef } from '../commun/page-def';
import { AppRoutes } from '../app-pages';
import { Identifiant } from '../securite/identifiant';
import { FournisseurRoutes } from '../fournisseur/fournisseur-pages';
import { ClientRoutes } from '../client/client-pages';
import { VisiteurRoutes } from '../visiteur/visiteur-pages';
import { ApiResult } from '../commun/api-results/api-result';
import { ILienDef } from '../disposition/fabrique/fabrique-lien';
import { ValeurTexteDef } from '../commun/kf-composants/kf-partages/kf-texte-def';
import { IUrlDef } from '../disposition/fabrique/fabrique-url';

@Injectable({
    providedIn: 'root'
})
export class RouteurService {
    erreurDeRoute: string;

    constructor(
        public router: Router,
        private identification: IdentificationService,
        public navigation: NavigationService,
    ) { }

    routesSite(nomSite: string, identifiant: Identifiant): ISiteRoutes {
        if (nomSite) {
            return identifiant
                ? identifiant.estFournisseurDeNomSite(nomSite)
                    ? FournisseurRoutes
                    : identifiant.estUsagerDeNomSite(nomSite)
                        ? ClientRoutes
                        : VisiteurRoutes
                : VisiteurRoutes;
        }
    }

    /**
     * préfixe l'url définie par segments par l'url racine du site pour l'identifiant
     * @param segments de l'url relative
     */
    urlDansSite(segments?: string[]): string {
        const site: Site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        return site
            ? SiteRoutes.urlSite(site.nomSite, identifiant, segments)
            : AppSiteRoutes.url(segments);
    }

    navigue(segments?: string[], params?: any) {
        if (params) {
            this.router.navigate([this.urlDansSite(segments), params]);
        } else {
            this.router.navigate([this.urlDansSite(segments)]);
        }
    }

    navigueVersErreur(apiResult: ApiResult) {
        if (apiResult.routeErreurAbsolue) {
            this.navigue(apiResult.routeErreur);
        } else {
            this.navigue(apiResult.routeErreur, apiResult.paramRouteErreur);
        }
    }

    navigate(routes: any[]) {
        this.router.navigate(routes);
    }

    urlDeDef(def: IUrlDef): string {
        const segments: string[] = def.pageDef ? [def.pageDef.urlSegment].concat(def.keys) : def.keys;
        return  def.nomSite
            ? def.routes.url(ValeurTexteDef(def.nomSite), segments)
            : AppRoutes.url(segments);
    }

    urlPageDef(pageDef: PageDef, routes?: ISiteRoutes, nomSite?: string): string {
        return  nomSite ? routes.url(nomSite, [pageDef.urlSegment]) : AppRoutes.url([pageDef.urlSegment]);
    }

    naviguePageDef(pageDef: PageDef, routes?: ISiteRoutes, nomSite?: string) {
        const urlDef: IUrlDef = {
            pageDef,
            routes,
            nomSite,
        };
        this.router.navigate([this.urlDeDef(urlDef)]);
    }

    navigueUrlDef(urlDef: IUrlDef) {
        const url = this.urlDeDef(urlDef);
        let params: { [key: string]: string };
        if (urlDef.params) {
            params = {};
            urlDef.params.forEach(p => params[p.nom] = p.valeur);
            this.router.navigate([url, params]);
        } else {
            this.router.navigate([url]);
        }
    }
}
