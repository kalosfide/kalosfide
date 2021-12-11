import { SitePages } from '../site/site-pages';
import { PageDef } from '../commun/page-def';

export class FournisseurPages {
    static accueil: PageDef = SitePages.accueil;
    static catalogue: PageDef = SitePages.catalogue;

    static livraison: PageDef = {
        path: 'livraison',
        lien: 'Livraison',
        title: 'Livraison',
        titre: 'Livraison',
    };
    static facture: PageDef = {
        path: 'facture',
        lien: 'Factures',
        title: 'Factures',
        titre: 'Factures'
    };
    static documents: PageDef = {
        path: 'documents',
        lien: 'Documents',
        title: 'Documents',
        titre: 'Documents',
    };
    static clients: PageDef = {
        path: 'clients',
        lien: 'Clients',
        title: 'Clients',
        titre: 'Clients',
    };
    static gestion: PageDef = {
        path: 'gestion',
        lien: 'Gestion',
        title: 'Gestion',
        titre: 'Gestion',
    };
    static site: PageDef = {
        path: 'site',
        lien: 'Site',
        title: 'Site',
        titre: 'Site',
    };
}
