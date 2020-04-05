
export enum EtatClient {
    /**
     * état d'un client qui a créé son compte et n'est pas encore été validé par le fournisseur
     * le client peut commander et accèder à ses documents
     */
    nouveau = 'N',

    /**
     * état d'un client qui a créé son compte et a été validé par le fournisseur ou qui a été créé par le fournisseur
     * les commandes de ce client n'ont pas besoin d'être validées lors de la réception par le fournisseur
     */
    actif = 'A',

    /**
     * état d'un client qui a créé son compte, qui a des données et qui va quitter le site
     * pendant un mois il peut télécharger les données de ses commandes
     */
    inactif = 'I',

    /**
     * état d'un client qui a des données et qui a quitté le site
     * ses données personnelles ont été rendues anonymes mais les données de ses commandes sont conservées
     */
    exclu = 'X',
}
export function TexteEtatClient(type: string): string {
    switch (type) {
        case 'N':
            return 'nouveau';
        case 'A':
            return 'actif';
        case 'I':
            return 'inactif';
        case 'X':
            return 'exclu';
        default:
            break;
    }
}
export function DescriptionEtatClient(type: string): string {
    switch (type) {
        case 'N':
            return ``;
        case 'A':
            return ``;
        case 'I':
            return ``;
        case 'X':
            return ``;
        default:
            break;
    }
}
