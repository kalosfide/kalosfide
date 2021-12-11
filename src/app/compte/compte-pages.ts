import { PageDef } from '../commun/page-def';

export class ComptePages {
    static ajoute: PageDef = {
        path: 'ajoute',
        lien: 'Créer un compte',
        title: 'Création',
        titre: 'Créer un compte',
    };
    static     connection: PageDef = {
        path: 'connection',
        lien: 'Connection',
        title: 'Connection',
        titre: 'Connection',
    };
    static confirmeEmail: PageDef = {
        path: 'confirmeEmail',
        title: 'Confirme email',
        titre: 'Confirmation de votre adresse email',
    };

    static deconnection: PageDef = {
        path: 'deconnection',
        lien: 'Déconnection',
        title: 'Déconnection',
    };
    static oubliMotDePasse: PageDef = {
        path: 'oubliMotDePasse',
        lien: 'Mot de passe oublié?',
        title: 'Mot de passe oublié',
        titre: 'Mot de passe oublié',
    };
    static réinitialiseMotDePasse: PageDef = {
        path: 'réinitialiseMotDePasse',
        title: 'Réinitialisation mot de passe',
        titre: 'Réinitialisation du mot de passe',
    };
    static changeMotDePasse: PageDef = {
        lien: 'Changer de mot de passe',
        path: 'changeMotDePasse',
        title: 'Changement mot de passe',
        titre: 'Changement du mot de passe',
    };
    static changeEmail: PageDef = {
        lien: `Changer d'adresse email`,
        path: 'changeEmail',
        title: 'Changement email',
        titre: `Changement d'adresse email`,
    };
    static confirmeChangeEmail: PageDef = {
        path: 'confirmeChangeEmail',
        title: 'Confirme nouvel email',
        titre: 'Confirmation de votre nouvelle adresse email',
    };
    static gestion: PageDef = {
        path: 'monCompte',
        lien: 'Mon compte',
        title: 'Mon compte',
        titre: 'Mon compte',
    };
};
