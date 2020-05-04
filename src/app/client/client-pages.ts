import { SiteRoutes, SitePages, ISiteRoutes } from '../site/site-pages';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class ClientPages  {
    static accueil: PageDef = SitePages.accueil;
    static produits: PageDef = SitePages.catalogue;
    static commandes: PageDef = {
        urlSegment: 'commandes',
        lien: 'Commandes',
        title: 'Commande',
        titre: 'Commande',
    };
    static documents: PageDef = {
        urlSegment: 'documents',
        lien: 'Documents',
        title: 'Documents',
        titre: 'Documents',
    };
    static contact: PageDef = {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    };
}

class CClientRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments: string[]): string {
        return SiteRoutes.urlRole(nomSite, SitePages.client.urlSegment, segments);
    }
    get urlBase(): string {
        return SiteRoutes.urlRole(SiteRoutes.urlBase, SitePages.client.urlSegment);
    }
}
export const ClientRoutes = new CClientRoutes();
