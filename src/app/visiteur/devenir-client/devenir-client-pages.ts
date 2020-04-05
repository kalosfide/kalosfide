import { VisiteurRoutes, VisiteurPages } from 'src/app/visiteur/visiteur-pages';

export const DevenirClientPages = {
    connection: {
        urlSegment: 'connection',
        lien: 'Connection',
        titre: 'Vos coordonnées de connection'
    },
    profil: {
        urlSegment: 'profil',
        lien: 'Informations',
        titre: 'Vos informations pour le fournisseur'
    },
    validation: {
        urlSegment: 'validation',
        lien: 'Validation',
        titre: 'Validez votre enregistrement'
    },
};

export class DevenirClientRoutes {

    static url(nomSite: string, segment: string): string {
        return VisiteurRoutes.url(nomSite, [VisiteurPages.devenirClient.urlSegment, segment]);
    }
}
