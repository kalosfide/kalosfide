import { PageDef } from 'src/app/commun/page-def';

export class ProduitPages {
    static index: PageDef = {
        path: 'index',
        lien: 'Produits',
        title: 'Liste',
        titre: 'Produits',
    };
    static ajoute: PageDef = {
        path: 'ajoute',
        lien: 'Nouveau produit',
        title: 'Nouveau',
        titre: 'Créer un nouveau produit',
    };
    static edite: PageDef = {
        path: 'edite',
        lien: 'Modifier',
        title: 'Modifier',
        titre: 'Modifier un produit',
    };
}
