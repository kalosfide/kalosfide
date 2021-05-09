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
    static apiErreur: PageDef = {
        urlSegment: 'erreur',
        title: 'Erreur',
        titre: 'Erreur du serveur'
    };
    static apiErreurModal: PageDef = {
        urlSegment: 'erreurModal',
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
        AppPages.apiErreur,
        AppPages.administrateur,
    ];
    /**
     * Url de redirection des routes ** des RouterModule
     */
    static urlIntrouvable = `${AppPages.appSite.urlSegment}/${AppPages.introuvable.urlSegment}`;
}

export class AppRoutesClass extends BaseRoutes {
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
