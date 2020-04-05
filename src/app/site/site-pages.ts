import { AppPages, AppRoutes } from '../app-pages';
import { Identifiant } from '../securite/identifiant';
import { TypesRoles } from '../securite/type-role';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class SitePages {
    static fournisseur: PageDef = {
        urlSegment: TypesRoles.fournisseur,
    };
    static client: PageDef = {
        urlSegment: TypesRoles.client,
    };
    static visiteur: PageDef = {
        urlSegment: TypesRoles.visiteur,
    };
    static accueil: PageDef = {
        urlSegment: 'accueil',
        lien: '',
        title: 'Accueil',
        titre: 'Accueil',
    };
    static catalogue: PageDef = {
        urlSegment: 'catalogue',
        lien: 'Catalogue',
        title: 'Catalogue',
        titre: 'Catalogue',
    };
    static commandes: PageDef = {
        urlSegment: 'commandes',
        lien: 'Commandes',
        title: 'Commande',
        titre: 'Commande',
    };
    static contact: PageDef = {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    };
    static apropos: PageDef = {
        urlSegment: 'apropos',
        lien: 'A propos',
        title: 'A propos',
    };
}

export interface ISiteRoutes {
    url: (nomSite: string, segments?: string[]) => string;
    urlBase: string;
}

export function iSiteRoutePlusSegments(base: ISiteRoutes, segmentsAAjouter: string[]): ISiteRoutes {
    return {
        url: (nomSite: string, segments?: string[]) => base.url(nomSite, segmentsAAjouter.concat(segments ? segments : [])),
        urlBase: base.url(base.urlBase, segmentsAAjouter)
    };
}

class CSiteRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(AppPages.site.urlSegment, nomSite);
        if (segments && segments.length > 0) {
            s = s.concat(segments);
        } else {
            s.push(SitePages.accueil.urlSegment);
        }
        return AppRoutes.url(s);
    }
    get urlBase() {
        return 'nomSite';
    }
    urlRole(nomSite: string, typeRole: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(AppPages.site.urlSegment, nomSite, typeRole);
        if (segments && segments.length > 0) {
            s = s.concat(segments);
        } else {
            s.push(SitePages.accueil.urlSegment);
        }
        return AppRoutes.url(s);
    }
    urlSite(nomSite: string, identifiant: Identifiant, segments?: string[]): string {
        const typeRole: string = identifiant
            ? identifiant.estFournisseurDeNomSite(nomSite)
                ? SitePages.fournisseur.urlSegment
                : identifiant.estUsagerDeNomSite(nomSite)
                    ? SitePages.client.urlSegment
                    : SitePages.visiteur.urlSegment
            : SitePages.visiteur.urlSegment;
        return this.urlRole(nomSite, typeRole, segments);
    }

    /**
     * retourne le nom du site si la route passe par un site
     * @param routeUrl url à examiner
     */
    nomSite(routeUrl: string): string {
        const segments = routeUrl.split(this.séparateur);
        if (segments.length > 2 && segments[1] === AppPages.site.urlSegment) {
            return segments[2];
        }
    }

    /**
     * retourne un array de string
     * [0] nom du site si la route passe par un site
     * [1] préfixe de l'identifiant s'il y un site (Visiteur par défaut)
     * @param routeUrl url à examiner
     */
    nomSite_Base(routeUrl: string): string[] {
        const segments = routeUrl.split(this.séparateur);
        if (segments.length > 2 && segments[1] === AppPages.site.urlSegment) {
            const nomSiteBase = [segments[2]];
            if (segments.length > 3) {
                const segmentBase = segments[3];
                if (segmentBase === SitePages.fournisseur.urlSegment
                    || segmentBase === SitePages.client.urlSegment
                    || segmentBase === SitePages.visiteur.urlSegment
                ) {
                    nomSiteBase.push(segmentBase);
                }
            } else {
                nomSiteBase.push(SitePages.visiteur.urlSegment);
            }
            return nomSiteBase;
        }
    }

    /**
     * retourne un array de string
     * [0] nom du site si la route passe par un site
     * [1] préfixe de l'identifiant s'il y a un site (Visiteur par défaut)
     * [2] urlSegment s'il y un site (Accueil par défaut)
     * @param routeUrl url à examiner
     */
    nomSite_typeRole_page(routeUrl: string): {
        nomSite: string,
        typeRole: string,
        page: string,
    } {
        const segments = routeUrl.split(this.séparateur);
        if (segments.length > 2 && segments[1] === AppPages.site.urlSegment) {
            const nomSite = segments[2];
            let typeRole: string = SitePages.visiteur.urlSegment;
            let page: string = SitePages.accueil.urlSegment;
            if (segments.length > 3) {
                typeRole = segments[3];
                if (typeRole === SitePages.fournisseur.urlSegment
                    || typeRole === SitePages.client.urlSegment
                    || typeRole === SitePages.visiteur.urlSegment
                ) {
                    if (segments.length > 4) {
                        page = segments[4];
                    }
                }
            }
            return {
                nomSite,
                typeRole,
                page
            };
        }
    }
}

export const SiteRoutes = new CSiteRoutes();
