import { PageDef } from 'src/app/commun/page-def';

export class CategoriePages {
    static index: PageDef = {
        path: 'index',
        lien: 'Retour à la liste des catégories',
        title: 'Catégories',
        titre: 'Catégories',
    };
    static ajoute: PageDef = {
        path: 'ajoute',
        lien: 'Créer une nouvelle catégorie',
        title: 'Créer',
        titre: 'Créer une nouvelle catégorie',
    };
    static edite: PageDef = {
        path: 'edite',
        lien: 'Modifier',
        title: 'Modifier',
        titre: 'Modifier une catégorie',
    };
}
