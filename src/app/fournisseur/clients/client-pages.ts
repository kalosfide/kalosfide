import { iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { FournisseurPages, FournisseurSiteRoutes } from '../fournisseur-pages';
import { PageDef } from 'src/app/commun/page-def';

export class FournisseurClientPages {
    static accueil: PageDef = {
        urlSegment: 'accueil',
        lien: 'Accueil',
        title: 'Accueil',
        titre: 'Accueil',
    };
    static index: PageDef = {
        urlSegment: 'index',
        lien: 'Comptes',
        title: 'Comptes',
        titre: 'Comptes',
    };
    static ajoute: PageDef = {
        urlSegment: 'ajoute',
        lien: 'Créer un nouveau client',
        title: 'Clients - Créer',
        titre: 'Créer un nouveau client',
    };
    static invitations: PageDef = {
        urlSegment: 'invitations',
        lien: 'Invitations',
        title: 'Invitations',
        titre: 'Invitations',
    };
    static invite: PageDef = {
        urlSegment: 'invite',
        lien: 'Inviter',
        title: 'Clients - Inviter',
        titre: 'Inviter un client',
    };
    static inviteClient: PageDef = {
        urlSegment: 'invite',
        lien: 'Inviter',
        title: 'Clients - Inviter',
        titre: 'Inviter ',
    };
    static réinvite: PageDef = {
        urlSegment: 'reinvite',
        lien: 'Inviter',
        title: 'Clients - Inviter',
        titre: 'Réinviter ',
    };
    static aide: PageDef = {
        urlSegment: 'aide',
        lien: 'Aide',
        title: 'Clients - Aide',
        titre: 'Aide sur la gestion des clients',
    };
    static accepte: PageDef = {
        urlSegment: 'accepte',
        lien: 'Accepter',
        title: 'Clients - Accepter',
        titre: 'Accepter un nouveau client',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Clients - Modifier',
        titre: 'Modifier un client',
    };
    static exclut: PageDef = {
        urlSegment: 'exclut',
        lien: 'Exclure',
        title: 'Clients - Exclure',
        titre: 'Exclure un client',
    };
}

export const FournisseurClientRoutes = iSiteRoutePlusSegments(FournisseurSiteRoutes, [FournisseurPages.clients.urlSegment]);
