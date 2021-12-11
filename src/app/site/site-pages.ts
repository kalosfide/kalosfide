import { TypesRoles } from '../securite/type-role';
import { PageDef } from '../commun/page-def';

export class SitePages {
    static fournisseur: PageDef = {
        path: TypesRoles.fournisseur,
    };
    static client: PageDef = {
        path: TypesRoles.client,
    };

    static visiteur: PageDef = {
        path: TypesRoles.visiteur,
    };
    static accueil: PageDef = {
        path: 'accueil',
        lien: 'Accueil',
        title: 'Accueil',
        titre: 'Accueil',
    };
    static catalogue: PageDef = {
        path: 'catalogue',
        lien: 'Catalogue',
        title: 'Catalogue',
        titre: 'Catalogue',
    };
    static contact: PageDef = {
        path: 'contact',
        lien: 'Contact',
        title: 'Contact',
    };
    static apropos: PageDef = {
        path: 'apropos',
        lien: 'A propos',
        title: 'A propos',
    };
}
