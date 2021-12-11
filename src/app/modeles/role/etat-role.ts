import { Client } from "../client/client";
import { Role } from "./role";

export enum IdEtatRole {
    /**
     * état d'un client qui a créé son compte et n'est pas encore été validé par le fournisseur
     * le client peut commander et accèder à ses documents
     * Le Fournisseur ne peut pas créer de documents
     */
    nouveau = 'N',

    /**
     * état d'un client qui a créé son compte et a été validé par le fournisseur ou qui a été créé par le fournisseur
     */
    actif = 'A',

    /**
     * état d'un client qui a créé son compte, qui a des données et qui va quitter le site
     * pendant un mois il peut télécharger les données de ses commandes
     */
    inactif = 'I',

    /**
     * état d'un client qui a des données et qui a quitté le site
     */
    fermé = 'F',
}

export class EtatRole {
    valeur: IdEtatRole;
    texte: string;
    vérifie: (role: Role) => boolean;
}

export class EtatsRole {
    static nouveau: EtatRole = {
        valeur: IdEtatRole.nouveau,
        texte: 'nouveau',
        vérifie: (role: Role) => role.etat === IdEtatRole.nouveau
    };

    static actif: EtatRole = {
        valeur: IdEtatRole.actif,
        texte: 'actif',
        vérifie: (role: Role) => role.etat === IdEtatRole.actif
    };

    static inactif: EtatRole = {
        valeur: IdEtatRole.inactif,
        texte: 'inactif',
        vérifie: (role: Role) => role.etat === IdEtatRole.inactif
    };

    static fermé: EtatRole = {
        valeur: IdEtatRole.fermé,
        texte: 'fermé',
        vérifie: (role: Role) => role.etat === IdEtatRole.fermé
    };
    static états: EtatRole[] = [EtatsRole.nouveau, EtatsRole.actif, EtatsRole.inactif, EtatsRole.fermé];
    static état(id: string): EtatRole {
        return EtatsRole.états.find(e => e.valeur === id);
    }
}

export function TexteEtatRole(type: string): string {
    switch (type) {
        case IdEtatRole.nouveau:
            return 'nouveau';
        case IdEtatRole.actif:
            return 'actif';
        case IdEtatRole.inactif:
            return 'inactif';
        case IdEtatRole.fermé:
            return 'fermé';
        default:
            break;
    }
}
