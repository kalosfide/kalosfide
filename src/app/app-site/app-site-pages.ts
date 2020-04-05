import { AppSite } from './app-site';
import { AppPages, AppRoutes } from '../app-pages';

export const AppSitePages = {
    index: {
        urlSegment: AppSite.urlSegment,
        lien: AppSite.texte,
        titre: AppSite.titre,
        title: AppSite.titre,
    },
    sites: {
        urlSegment: 'sites',
        lien: 'Tous les sites des fournisseurs',
        title: 'Sites des fournisseurs',
        titre: 'Tous les sites des fournisseurs',
    },
    devenirFournisseur: {
        urlSegment: 'devenirFournisseur',
        lien: 'Devenir fournisseur',
        title: 'Devenir fournisseur',
        titre: 'Enregistrement d\'un nouveau fournisseur'
    },
    contact: {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    },
    apropos: {
        urlSegment: 'apropos',
        lien: 'A propos',
        title: 'A propos',
    },
};

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
