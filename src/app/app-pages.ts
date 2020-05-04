import { PageDef, BaseRoutes } from './commun/page-def';
import { AppSite } from './app-site/app-site';

export class AppPages {
    static appSite: PageDef = {
        urlSegment: 'a',
        titre: AppSite.titre,
        title: AppSite.titre,
    };
    static site: PageDef = {
        urlSegment: 's',
    };
    static compte: PageDef = {
        urlSegment: 'compte',
        title: 'Compte',
        titre: 'Compte',
    };
    static introuvable: PageDef = {
        urlSegment: 'introuvable',
        title: 'Introuvable',
        titre: 'Ressources introuvables'
    };
    static interdit: PageDef = {
        urlSegment: 'interdit',
        title: 'Interdit',
        titre: 'Accès refusé'
    };
    static conflit: PageDef = {
        urlSegment: 'conflit',
        title: 'Verrouillé',
        titre: 'Ressources verrouillées'
    };
    static apiErreur: PageDef = {
        urlSegment: 'apiErreur',
        title: 'Erreur',
        titre: 'Erreur du serveur'
    };
    static administrateur: PageDef = {
        urlSegment: 'administrateur',
    };
    static pageDefs: PageDef[] = [
        AppPages.appSite,
        AppPages.site,
        AppPages.compte,
        AppPages.introuvable,
        AppPages.interdit,
        AppPages.conflit,
        AppPages.apiErreur,
        AppPages.administrateur,
    ];
}

class AppRoutesClass extends BaseRoutes {
    private images = '/assets';

    urlIntrouvable = AppPages.appSite.urlSegment + this.séparateur + AppPages.introuvable.urlSegment;

    éclateString(s: string): string[] {
        return s.split(this.séparateur);
    }

    éclateStrings(ss: any[]): string[] {
        const strings: string[] = [];
        ss.forEach(s => {
            if (typeof(s) === 'string') {
                strings.concat(this.éclateString(s));
            }
        });
        return strings;
    }
    url(segments?: string[]): string {
        let u = this.séparateur;
        if (segments) {
            u += segments.join(this.séparateur);
        }
        return u;
    }

    urlImage(...segments: string[]): string {
        return this.images + this.séparateur + segments.join(this.séparateur);
    }

}

export const AppRoutes = new AppRoutesClass();
