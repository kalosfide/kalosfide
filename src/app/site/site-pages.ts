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
    static pasOuvert: PageDef = {
        urlSegment: 'pasOuvert',
        lien: '',
        title: 'Fermé',
        titre: 'Site fermé'
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
    url: (urlSite: string, segments?: string[]) => string;
    urlBase: string;
}

export function iSiteRoutePlusSegments(base: ISiteRoutes, segmentsAAjouter: string[]): ISiteRoutes {
    return {
        url: (urlSite: string, segments?: string[]) => base.url(urlSite, segmentsAAjouter.concat(segments ? segments : [])),
        urlBase: base.url(base.urlBase, segmentsAAjouter)
    };
}

class CSiteRoutes extends BaseRoutes implements ISiteRoutes {
    url(urlSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(AppPages.site.urlSegment, urlSite);
        if (segments && segments.length > 0) {
            s = s.concat(segments);
        } else {
            s.push(SitePages.accueil.urlSegment);
        }
        return AppRoutes.url(s);
    }
    get urlBase() {
        return 'urlSite';
    }
    urlDeRole(urlSite: string, typeRole: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(AppPages.site.urlSegment, urlSite, typeRole);
        if (segments && segments.length > 0) {
            s = s.concat(segments);
        } else {
            s.push(SitePages.accueil.urlSegment);
        }
        return AppRoutes.url(s);
    }
    urlDIdentifiant(urlSite: string, identifiant: Identifiant, segments?: string[]): string {
        const typeRole: string = identifiant
            ? identifiant.estFournisseurDeSiteParUrl(urlSite)
                ? SitePages.fournisseur.urlSegment
                : identifiant.estUsagerDeSiteParUrl(urlSite)
                    ? SitePages.client.urlSegment
                    : SitePages.visiteur.urlSegment
            : SitePages.visiteur.urlSegment;
        return this.urlDeRole(urlSite, typeRole, segments);
    }

    /**
     * retourne le segment d'url du site si la route passe par un site
     * @param routeUrl url à examiner
     */
    urlSite(routeUrl: string): string {
        const segments = routeUrl.split(this.séparateur);
        if (segments.length > 2 && segments[1] === AppPages.site.urlSegment) {
            return segments[2];
        }
    }
}

export const SiteRoutes = new CSiteRoutes();
