import { SitePages, iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { FournisseurRoutes } from '../fournisseur-pages';
import { PageDef } from 'src/app/commun/page-def';

export class CataloguePages {
    static produits: PageDef = {
        urlSegment: 'produits',
        lien: 'Produits',
        title: 'Produits',
        titre: 'Produits',
    };
    static categories: PageDef = {
        urlSegment: 'categories',
        lien: 'Catégories',
        title: 'Catégories',
        titre: 'Catégories',
    };
}

export const CatalogueRoutes = iSiteRoutePlusSegments(FournisseurRoutes, [SitePages.catalogue.urlSegment]);
