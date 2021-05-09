import { FournisseurRoutes, FournisseurPages, FournisseurSiteRoutes } from '../fournisseur-pages';
import { iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { PageDef } from 'src/app/commun/page-def';

export class FSitePages  {
    static ouverture: PageDef = {
        urlSegment: 'ouverture',
        lien: '',
        title: 'Ouverture',
        titre: 'Ouverture du site',
    };
    static index: PageDef = {
        urlSegment: 'index',
        lien: 'Retour à la liste des produits',
        title: 'Produits',
        titre: '',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Modifier',
        titre: 'Modifier le site',
    };
}

export const FSiteRoutes = iSiteRoutePlusSegments(FournisseurSiteRoutes, [FournisseurPages.site.urlSegment]);
