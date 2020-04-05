import { AppPages } from '../app-pages';
import { AppSiteRoutes } from '../app-site/app-site-pages';
import { SiteRoutes } from '../site/site-pages';
import { Identifiant } from '../securite/identifiant';

export const ComptePages = {
    connection: {
        urlSegment: 'connection',
        lien: 'Connection',
        title: 'Connection',
        titre: 'Connection',
    },
    deconnection: {
        urlSegment: 'deconnection',
        lien: 'Déconnection',
        title: 'Déconnection',
    },
    gestion: {
        urlSegment: 'monCompte',
        lien: 'Mon compte',
        title: 'Mon compte',
        titre: 'Mon compte',
    },
};

export class CompteRoutes {

    static route(segments?: string[]): string[] {
        let s: string[] = [];
        s.push(AppPages.compte.urlSegment);
        if (segments) {
            s = s.concat(segments);
        }
        return s;
    }
}
