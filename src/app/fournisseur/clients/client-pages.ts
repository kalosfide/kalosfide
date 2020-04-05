import { ISiteRoutes, iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { BaseRoutes } from 'src/app/commun/page-def';

export const ClientPages = {
    index: {
        urlSegment: 'index',
        lien: 'Retour à la liste des clients',
        title: 'Clients',
        titre: 'Clients',
    },
    ajoute: {
        urlSegment: 'ajoute',
        lien: 'Créer un nouveau client',
        title: 'Clients - Créer',
        titre: 'Créer un nouveau client',
    },
    accepte: {
        urlSegment: 'accepte',
        lien: 'Accepter',
        title: 'Clients - Accepter',
        titre: 'Accepter un nouveau client',
    },
    edite: {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Clients - Modifier',
        titre: 'Modifier un client',
    },
    exclut: {
        urlSegment: 'exclut',
        lien: 'Exclure',
        title: 'Clients - Exclure',
        titre: 'Exclure un client',
    },
};

export const ClientRoutes = iSiteRoutePlusSegments(FournisseurRoutes, [FournisseurPages.clients.urlSegment]);
