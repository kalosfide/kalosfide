import { Injectable } from '@angular/core';
import { NavigationExtras, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from './navigation.service';
import { PageDef } from '../commun/page-def';
import { IUrlDef } from '../disposition/fabrique/fabrique-url';
import { ApiResultErreur } from '../api/api-results/api-result-erreur';
import { AppPages } from '../app-pages';
import { Stockage } from './stockage/stockage';
import { StockageService } from './stockage/stockage.service';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { Routeur } from '../commun/routeur';

@Injectable({
    providedIn: 'root'
})
export class RouteurService {

    private stockageErreur: Stockage<ApiResultErreur>;

    /**
     * Erreur stockée quand le routeur navigue vers une page erreur
     * ou quand le routeur retourne un UrlTree d'une page erreur à une garde
     * et lue par le resolver de cette page.
     */
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

    /**
     * préfixe l'url définie par segments par l'url racine du site pour l'identifiant
     * @param segments de l'url relative
     */
    private urlErreur(): string {
        const site = this.identification.siteEnCours;
        if (!site) {
            return Fabrique.url.appRouteur.appSite.url();
        }
        return Fabrique.url.appRouteur.routeurDeSite(site).url(AppPages.apiErreur.path);
    }

    navigueVersPageErreur(apiResult: ApiResultErreur) {
        this.stockageErreur.fixeStock(apiResult);
        this.router.navigate([this.urlErreur()]);
    }

    navigueVersPageErreur401(apiResult: ApiResultErreur) {
        this.stockageErreur.fixeStock(apiResult);
        if (apiResult.messages) {
            this.router.navigate([Fabrique.url.appRouteur.appSite.url(AppPages.apiErreur.path)]);
        } else {
            this.router.navigate([Fabrique.url.appRouteur.appSite.url()]);
        }
    }

    navigueVersPageErreur403(apiResult: ApiResultErreur) {
        this.stockageErreur.fixeStock(apiResult);
        this.router.navigate([Fabrique.url.appRouteur.appSite.url(AppPages.apiErreur.path)]);
    }

    urlTreeErreur(apiResult: ApiResultErreur): UrlTree {
        this.stockageErreur.fixeStock(apiResult);
        return this.router.createUrlTree([this.urlErreur()]);
    }

    urlTreeErreur401(apiResult: ApiResultErreur): UrlTree {
        this.stockageErreur.fixeStock(apiResult);
        if (apiResult.messages) {
            return this.router.createUrlTree([Fabrique.url.appRouteur.appSite.url(AppPages.apiErreur.path)]);
        } else {
            return this.router.createUrlTree([Fabrique.url.appRouteur.appSite.url()]);
        }
    }

    urlTreeErreur403(apiResult: ApiResultErreur): UrlTree {
        this.stockageErreur.fixeStock(apiResult);
        return this.router.createUrlTree([Fabrique.url.appRouteur.appSite.url(AppPages.apiErreur.path)]);
    }

    navigate(routes: any[], extras?: NavigationExtras) {
        this.router.navigate(routes, extras);
    }

    urlDeDef(def: IUrlDef): string {
        if (def.local) {
            return '.';
        }
        let segments: string[] = def.pageDef ? [def.pageDef.path] : [];
        if (def.keys) {
            segments = segments.concat(def.keys);
        }
        return def.routeur ? def.routeur.url(...segments) : Fabrique.url.appRouteur.appSite.url(...segments);
    }

    naviguePageDef(pageDef: PageDef, routeur?: Routeur) {
        const urlDef: IUrlDef = {
            pageDef,
            routeur
        };
        this.router.navigate([this.urlDeDef(urlDef)]);
    }

    urlTreePageDef(pageDef: PageDef, routeur?: Routeur): UrlTree {
        const urlDef: IUrlDef = {
            pageDef,
            routeur,
        };
        return this.router.createUrlTree([this.urlDeDef(urlDef)]);
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

    private urlSegmentsUrlDef(urlDef: IUrlDef): any[] {
        const commands: any[] = [this.urlDeDef(urlDef)];
        let params: { [key: string]: string };
        if (urlDef.params) {
            params = {};
            urlDef.params.forEach(p => params[p.nom] = p.valeur);
            commands.push(params);
        }
        return commands;
    }

    navigueUrlDef(urlDef: IUrlDef) {
        if (urlDef.fragment) {
            this.router.navigate(this.urlSegmentsUrlDef(urlDef), { fragment: urlDef.fragment });
        } else {
            this.router.navigate(this.urlSegmentsUrlDef(urlDef));
        }
    }

    urlTreeUrlDef(urlDef: IUrlDef): UrlTree {
        return this.router.createUrlTree(this.urlSegmentsUrlDef(urlDef));
    }

    navigueVersFragment(url: string, fragment: string) {
        // vérifie que l'url ne contient pas déjà un fragment
        const posFragment = url.indexOf('#');
        if (posFragment !== -1) {
            url = url.substr(0, posFragment - 1);
        }
        this.router.navigate([url], { fragment });
    }
}
