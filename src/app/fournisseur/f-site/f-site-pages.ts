import { PageDef } from 'src/app/commun/page-def';

export class FSitePages  {
    static ouverture: PageDef = {
        path: 'ouverture',
        lien: '',
        title: 'Ouverture',
        titre: 'Ouverture du site',
    };
    static index: PageDef = {
        path: 'index',
        lien: 'Retour à la liste des produits',
        title: 'Produits',
        titre: '',
    };
    static edite: PageDef = {
        path: 'edite',
        lien: 'Modifier',
        title: 'Modifier',
        titre: 'Modifier le site',
    };
}
