import { AppSite } from './app-site';
import { AppPages, AppRoutes } from '../app-pages';
import { PageDef } from '../commun/page-def';

export class AppSitePages {
    static accueil: PageDef = {
        urlSegment: AppSite.urlSegment,
        lien: AppSite.texte,
        titre: AppSite.titre,
        title: AppSite.titre,
    };
    static peuple: PageDef = {
        urlSegment: 'peuple',
        lien: 'Peuplement',
        titre: 'Peuplement de la BDD',
        title: 'Peuplement',
    };
    static devenirFournisseur: PageDef = {
        urlSegment: 'devenirFournisseur',
        lien: 'Devenir fournisseur',
        title: 'Devenir fournisseur',
        titre: `Enregistrement d'un nouveau fournisseur`
    };

    static devenirClient: PageDef = {
        urlSegment: 'devenirClient',
        lien: 'Devenir client',
        title: 'Devenir client',
        titre: `Enregistrement d'un nouveau client`,
    };
    static contact: PageDef = {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    };
    static apropos: PageDef = {
        urlSegment: 'apropos',
        lien: 'A propos',
        title: 'A propos',
    };
}

export interface IAppSiteRoutes {
    url: (segments?: string[]) => string;
}

class CAppSiteRoutes implements IAppSiteRoutes {
    url(segments?: string[]): string {
        let s: string[] = [];
        s.push(AppPages.appSite.urlSegment);
        if (segments) {
            s = s.concat(segments);
        }
        return AppRoutes.url(s);
    }
}
export const AppSiteRoutes = new CAppSiteRoutes();
