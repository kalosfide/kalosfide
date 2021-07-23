import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from './navigation.service';
import { Site } from '../modeles/site/site';
import { SiteRoutes, ISiteRoutes, SitePages } from '../site/site-pages';
import { AppSiteRoutes } from '../app-site/app-site-pages';
import { PageDef } from '../commun/page-def';
import { Identifiant } from '../securite/identifiant';
import { FournisseurRoutes } from '../fournisseur/fournisseur-pages';
import { ClientRoutes } from '../client/client-pages';
import { ValeurStringDef } from '../commun/kf-composants/kf-partages/kf-string-def';
import { IUrlDef } from '../disposition/fabrique/fabrique-url';
import { ApiResultErreur, ApiResultErreurSpéciale } from '../api/api-results/api-result-erreur';
import { AppPages } from '../app-pages';
import { ComptePages } from '../compte/compte-pages';
import { ApiResult404NotFound } from '../api/api-results/api-result-404-not-found';
import { Stockage } from './stockage/stockage';
import { StockageService } from './stockage/stockage.service';

@Injectable({
    providedIn: 'root'
})
export class RouteurService {

    private stockageErreur: Stockage<ApiResultErreur>;
    get apiErreur(): ApiResultErreur {
        return this.stockageErreur.litStock();
    }

    constructor(
        public router: Router,
        private identification: IdentificationService,
        public navigation: NavigationService,
        stockageService: StockageService
    ) {
        this.stockageErreur = stockageService.nouveau<ApiResultErreur>('apiErreur');
    }

    routesSite(urlSite: string, identifiant: Identifiant): ISiteRoutes {
        if (urlSite) {
            if (identifiant) {
                if (identifiant.estFournisseurDeSiteParUrl(urlSite)) {
                    return FournisseurRoutes;
                }
                if (identifiant.estUsagerDeSiteParUrl(urlSite)) {
                    return ClientRoutes;
                }
            }
        }
    }

    /**
     * préfixe l'url définie par segments par l'url racine du site pour l'identifiant
     * @param segments de l'url relative
     */
    urlDansSite(segments?: string[]): string {
        const site: Site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        if (!site) {
            return AppSiteRoutes.url(segments);
        }
        if (!identifiant) {
            return AppSiteRoutes.url([AppPages.compte.urlSegment, ComptePages.connection.urlSegment]);
        }
        const role = identifiant.roles.find(r => r.site.url === site.url);
        if (!role) {
            // l'utilisateur n'est pas usager du site
        }
        if (role.uid === site.uid && role.rno === site.rno) {
            // c'est le fournisseur du site
            return SiteRoutes.urlDeRole(site.url, SitePages.fournisseur.urlSegment, segments);
        }
        // c'est un client du site
        return SiteRoutes.urlDeRole(site.url, SitePages.client.urlSegment, segments);
    }

    navigue(segments?: string[], params?: any) {
        if (params) {
            this.router.navigate([this.urlDansSite(segments), params]);
        } else {
            this.router.navigate([this.urlDansSite(segments)]);
        }
    }

    navigueVersErreurModal(apiResult: ApiResultErreur) {
        this.stockageErreur.fixeStock(apiResult);
        this.router.navigate([this.urlDansSite([AppPages.apiErreurModal.urlSegment])]);
    }

    navigueVersPageErreur(apiResult: ApiResultErreur) {
        this.stockageErreur.fixeStock(apiResult);
        this.router.navigate([this.urlDansSite([AppPages.apiErreur.urlSegment])]);
    }

    navigueVersPageErreur401(apiResult: ApiResultErreur) {
        this.stockageErreur.fixeStock(apiResult);
        if (apiResult.messages) {
            this.router.navigate([AppSiteRoutes.url([AppPages.apiErreur.urlSegment])]);
        } else {
            this.router.navigate([AppSiteRoutes.url()]);
        }
    }

    navigate(routes: any[]) {
        this.router.navigate(routes);
    }

    urlDeDef(def: IUrlDef): string {
        let segments: string[] = def.pageDef ? [def.pageDef.urlSegment] : [];
        if (def.keys) {
            segments = segments.concat(def.keys);
        }
        return  def.urlSite
            ? def.routes.url(ValeurStringDef(def.urlSite), segments)
            : AppSiteRoutes.url(segments);
    }

    urlPageDef(pageDef: PageDef, routes?: ISiteRoutes, urlSite?: string): string {
        return  urlSite ? routes.url(urlSite, [pageDef.urlSegment]) : AppSiteRoutes.url([pageDef.urlSegment]);
    }

    naviguePageDef(pageDef: PageDef, routes?: ISiteRoutes, urlSite?: string) {
        const urlDef: IUrlDef = {
            pageDef,
            routes,
            urlSite,
        };
        this.router.navigate([this.urlDeDef(urlDef)]);
    }

    navigueRelatif(state: RouterStateSnapshot, vers: string) {
        const segments = state.url.split('/');
        const cibles = vers.split('/');
        let cible = cibles.shift();
        if (cible === '.') {
            cible = cibles.shift();
        } else {
            if (cible === '..') {
                while (cible === '..') {
                    segments.pop();
                    cible = cibles.shift();
                }
            } else {
                throw new Error(`Un chemin relatif doit commencer par un './' ou un ou plusieurs '../'`);
            }
        }
        while (cible) {
            if (cible === '.' || cible === '..') {
                    throw new Error(`'./' et '../' ne peuvent figurer qu'au début d'un chemin relatif`);
            }
            segments.push(cible);
            cible = cibles.shift();
        }
        const url = segments.join('/');
        this.router.navigateByUrl(url);
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
