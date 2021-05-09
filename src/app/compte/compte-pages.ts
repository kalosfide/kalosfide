import { AppPages } from '../app-pages';

export const ComptePages = {
    ajoute: {
        urlSegment: 'ajoute',
        lien: 'Créer un compte',
        title: 'Création',
        titre: 'Créer un compte',
    },
    connection: {
        urlSegment: 'connection',
        lien: 'Connection',
        title: 'Connection',
        titre: 'Connection',
    },
    confirmeEmail: {
        urlSegment: 'confirmeEmail',
        title: 'Confirme email',
        titre: 'Confirmation de votre adresse email',
    },

    deconnection: {
        urlSegment: 'deconnection',
        lien: 'Déconnection',
        title: 'Déconnection',
    },
    oubliMotDePasse: {
        urlSegment: 'oubliMotDePasse',
        lien: 'Mot de passe oublié?',
        title: 'Mot de passe oublié',
        titre: 'Mot de passe oublié',
    },
    réinitialiseMotDePasse: {
        urlSegment: 'réinitialiseMotDePasse',
        title: 'Réinitialisation mot de passe',
        titre: 'Réinitialisation du mot de passe',
    },
    changeMotDePasse: {
        lien: 'Changer de mot de passe',
        urlSegment: 'changeMotDePasse',
        title: 'Changement mot de passe',
        titre: 'Changement du mot de passe',
    },
    changeEmail: {
        lien: `Changer d'adresse email`,
        urlSegment: 'changeEmail',
        title: 'Changement email',
        titre: `Changement d'adresse email`,
    },
    confirmeChangeEmail: {
        urlSegment: 'confirmeChangeEmail',
        title: 'Confirme nouvel email',
        titre: 'Confirmation de votre nouvelle adresse email',
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
