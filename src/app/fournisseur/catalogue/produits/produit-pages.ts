import { iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { PageDef } from 'src/app/commun/page-def';
import { CatalogueRoutes, CataloguePages } from '../catalogue-pages';

export class ProduitPages {
    static index: PageDef = {
        urlSegment: 'index',
        lien: 'Produits',
        title: 'Liste',
        titre: 'Produits',
    };
    static ajoute: PageDef = {
        urlSegment: 'ajoute',
        lien: 'Nouveau produit',
        title: 'Nouveau',
        titre: 'Créer un nouveau produit',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Modifier',
        titre: 'Modifier un produit',
    };
    static supprime: PageDef = {
        urlSegment: 'supprime',
        lien: 'Supprimer',
        title: 'Produits - Supprimer',
        titre: 'Supprimer un produit',
    };
}

export const ProduitRoutes = iSiteRoutePlusSegments(CatalogueRoutes, [CataloguePages.produits.urlSegment]);
