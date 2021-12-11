import { PageDef } from "../commun/page-def";

export class AdminPages {
    static accueil: PageDef = {
        path: 'accueil',
        lien: 'Accueil',
        title: 'Accueil',
        titre: 'Accueil',
    };
    static utilisateurs: PageDef = {
        path: 'utilisateurs',
        lien: 'Utilisateurs',
        title: 'Utilisateurs',
        titre: 'Utilisateurs',
    };
    static fournisseurs: PageDef = {
        path: 'fournisseurs',
        lien: 'Fournisseurs',
        title: 'Fournisseurs',
        titre: 'Fournisseurs',
    };
    static nouveaux: PageDef = {
        path: 'nouveaux',
        lien: 'Nouveaux sites',
        title: 'Nouveaux sites',
        titre: 'Nouveaux sites',
    }
    static définitions: PageDef = {
        path: 'definitions',
        lien: 'Définitions',
        title: 'Définitions',
        titre: 'Définitions',
    };
    static méthodes: PageDef = {
        path: 'methodes',
        lien: 'Méthodes',
        title: 'Méthodes',
        titre: 'Méthodes',
    }
    static invitations: PageDef = {
        path: 'invitations',
        lien: 'Invitations',
        title: 'Invitations',
        titre: 'Invitations',
    };
    static invite: PageDef = {
        path: 'invite',
        lien: 'Inviter',
        title: 'Clients - Inviter',
        titre: 'Inviter un client',
    };
    static inviteClient: PageDef = {
        path: 'invite',
        lien: 'Inviter',
        title: 'Clients - Inviter',
        titre: 'Inviter ',
    };
    static réinvite: PageDef = {
        path: 'reinvite',
        lien: 'Inviter',
        title: 'Clients - Inviter',
        titre: 'Réinviter ',
    };
    static aide: PageDef = {
        path: 'aide',
        lien: 'Aide',
        title: 'Clients - Aide',
        titre: 'Aide sur la gestion des clients',
    };
    static active: PageDef = {
        path: 'active',
        lien: 'Activer',
        title: 'Clients - Activer',
        titre: 'Activer un nouveau client',
    };
    static edite: PageDef = {
        path: 'edite',
        lien: 'Modifier',
        title: 'Clients - Modifier',
        titre: 'Modifier un client',
    };
    static ferme: PageDef = {
        path: 'ferme',
        lien: 'Fermer',
        title: 'Clients - Fermer',
        titre: 'Fermer un compte client',
    };
}