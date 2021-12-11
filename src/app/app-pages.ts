import { PageDef, BaseRoutes } from './commun/page-def';
import { AppSite } from './app-site/app-site';

export class AppPages {
    static appSite: PageDef = {
        path: 'a',
        titre: AppSite.titre,
        title: AppSite.titre,
    };
    static site: PageDef = {
        path: 's',
    };
    static apiErreur: PageDef = {
        path: 'erreur',
        title: 'Erreur',
        titre: 'Erreur du serveur'
    };
    static admin: PageDef = {
        path: 'admin',
        lien: 'Administration',
        title: 'Administration',
        titre: 'Administration',
    };
}
