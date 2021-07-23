import { SiteRoutes, SitePages, ISiteRoutes } from '../site/site-pages';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class ClientPages  {
    static accueil: PageDef = SitePages.accueil;
    static catalogue: PageDef = SitePages.catalogue;
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
    static pasOuvert: PageDef = {
        urlSegment: 'pasOuvert',
        lien: '',
        title: 'Fermé',
        titre: 'Site fermé'
    };
}

class CClientRoutes extends BaseRoutes implements ISiteRoutes {
    url(urlSite: string, segments: string[]): string {
        return SiteRoutes.urlDeRole(urlSite, SitePages.client.urlSegment, segments);
    }
    get urlBase(): string {
        return SiteRoutes.urlDeRole(SiteRoutes.urlBase, SitePages.client.urlSegment);
    }
}
export const ClientRoutes = new CClientRoutes();
