import { ProduitPages, ProduitRoutes } from '../produits/produit-pages';
import { iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { PageDef } from 'src/app/commun/page-def';
import { CatalogueRoutes, CataloguePages } from '../catalogue-pages';

export class CategoriePages {
    static index: PageDef = {
        urlSegment: 'index',
        lien: 'Retour à la liste des catégories',
        title: 'Catégories',
        titre: 'Catégories',
    };
    static ajoute: PageDef = {
        urlSegment: 'ajoute',
        lien: 'Créer une nouvelle catégorie',
        title: 'Créer',
        titre: 'Créer une nouvelle catégorie',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Modifier',
        titre: 'Modifier une catégorie',
    };
    static supprime: PageDef = {
        urlSegment: 'supprime',
        lien: 'Supprimer',
        title: 'Catégories - Supprimer',
        titre: 'Supprimer une catégorie',
    };
}

export const CategorieRoutes = iSiteRoutePlusSegments(CatalogueRoutes, [CataloguePages.categories.urlSegment]);
