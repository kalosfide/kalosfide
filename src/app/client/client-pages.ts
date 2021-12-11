import { SitePages } from '../site/site-pages';
import { PageDef } from '../commun/page-def';

export class ClientPages  {
    static accueil: PageDef = SitePages.accueil;
    static catalogue: PageDef = SitePages.catalogue;
    static commandes: PageDef = {
        path: 'commande',
        lien: 'Commandes',
        title: 'Commande',
        titre: 'Commande',
    };
    static documents: PageDef = {
        path: 'documents',
        lien: 'Documents',
        title: 'Documents',
        titre: 'Documents',
    };
    static contact: PageDef = {
        path: 'contact',
        lien: 'Contact',
        title: 'Contact',
    };
    static pasOuvert: PageDef = {
        path: 'pasOuvert',
        lien: '',
        title: 'Fermé',
        titre: 'Site fermé'
    };
}
