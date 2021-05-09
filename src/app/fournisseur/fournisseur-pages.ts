import { SiteRoutes, ISiteRoutes, SitePages, iSiteRoutePlusSegments } from '../site/site-pages';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class FournisseurPages {
    static accueil: PageDef = SitePages.accueil;
    static catalogue: PageDef = SitePages.catalogue;

    static livraison: PageDef = {
        urlSegment: 'livraison',
        lien: 'Livraison',
        title: 'Livraison',
        titre: 'Livraison',
    };
    static facture: PageDef = {
        urlSegment: 'factures',
        lien: 'Factures',
        title: 'Factures',
        titre: 'Factures'
    };
    static documents: PageDef = {
        urlSegment: 'documents',
        lien: 'Documents',
        title: 'Documents',
        titre: 'Documents',
    };
    static clients: PageDef = {
        urlSegment: 'clients',
        lien: 'Clients',
        title: 'Clients',
        titre: 'Clients',
    };
    static site: PageDef = {
        urlSegment: 'site',
        lien: 'Site',
        title: 'Site',
        titre: 'Site',
    };
}

class CFournisseurRoutes extends BaseRoutes implements ISiteRoutes {
    url(urlSite: string, segments: any[]): string {
        return SiteRoutes.urlDeRole(urlSite, SitePages.fournisseur.urlSegment, segments);
    }
    get urlBase(): string {
        return SiteRoutes.urlDeRole(SiteRoutes.urlBase, SitePages.fournisseur.urlSegment);
    }
}
export const FournisseurRoutes = new CFournisseurRoutes();
export const FournisseurSiteRoutes = iSiteRoutePlusSegments(FournisseurRoutes, [FournisseurPages.site.urlSegment]);
