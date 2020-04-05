import { SiteRoutes, ISiteRoutes, SitePages } from '../site/site-pages';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class FournisseurPages {
    static accueil: PageDef = SitePages.accueil;
    static catalogue: PageDef = SitePages.catalogue;
    static commandes: PageDef = SitePages.commandes;
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


    static pageDefs: PageDef[] = [
        FournisseurPages.accueil,
        FournisseurPages.catalogue,
        FournisseurPages.commandes,
        FournisseurPages.livraison,
        FournisseurPages.facture,
        FournisseurPages.documents,
        FournisseurPages.clients,
        FournisseurPages.site,
    ];
}

class CFournisseurRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments: any[]): string {
        return SiteRoutes.urlRole(nomSite, SitePages.fournisseur.urlSegment, segments);
    }
    get urlBase(): string {
        return SiteRoutes.urlRole(SiteRoutes.urlBase, SitePages.fournisseur.urlSegment);
    }
    page(url: string): PageDef {
        const analyse = SiteRoutes.nomSite_typeRole_page(url);
        if (analyse.page) {
            return FournisseurPages.pageDefs.find(p => p.urlSegment === analyse.page);
        }
    }
}
export const FournisseurRoutes = new CFournisseurRoutes();