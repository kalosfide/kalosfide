import { PageDef } from 'src/app/commun/page-def';

export class FournisseurClientPages {
    static accueil: PageDef = {
        path: 'accueil',
        lien: 'Accueil',
        title: 'Accueil',
        titre: 'Accueil',
    };
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
    static index: PageDef = {
        path: 'index',
        lien: 'Comptes',
        title: 'Comptes',
        titre: 'Comptes',
    };
    static ajoute: PageDef = {
        path: 'ajoute',
        lien: 'Créer un nouveau client',
        title: 'Clients - Créer',
        titre: 'Créer un nouveau client',
    };
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
    static edite: PageDef = {
        path: 'edite',
        lien: 'Modifier',
        title: 'Clients - Modifier',
        titre: 'Modifier un client',
    };
}
