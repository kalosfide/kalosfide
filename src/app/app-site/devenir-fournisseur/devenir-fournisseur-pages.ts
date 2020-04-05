import { AppSiteRoutes, AppSitePages } from 'src/app/app-site/app-site-pages';

export const DevenirFournisseurPages = {
    connection: {
        urlSegment: 'connection',
        lien: 'Connection',
        titre: 'Vos coordonnées de connection'
    },
    profil: {
        urlSegment: 'profil',
        lien: 'Informations',
        titre: 'Vos informations pour vos clients'
    },
    site: {
        urlSegment: 'site',
        lien: 'Votre site',
        titre: 'Votre espace personnel'
    },
    validation: {
        urlSegment: 'validation',
        lien: 'Validation',
        titre: 'Validez votre enregistrement'
    },
};

export class DevenirFournisseurRoutes {

    public static url(segment: string): string {
        return AppSiteRoutes.url([AppSitePages.devenirFournisseur.urlSegment, segment]);
    }
}
