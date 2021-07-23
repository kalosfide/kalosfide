
export enum EtatClient {
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
export function TexteEtatClient(type: string): string {
    switch (type) {
        case EtatClient.nouveau:
            return 'nouveau';
        case EtatClient.actif:
            return 'actif';
        case EtatClient.inactif:
            return 'inactif';
        case EtatClient.fermé:
            return 'fermé';
        default:
            break;
    }
}
