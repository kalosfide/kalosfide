
export enum EtatRole {
    /**
     * état d'un client qui a créé son compte et n'est pas encore été validé par le fournisseur
     * le client peut commander et accèder à ses documents
     * Le Fournisseur ne peut pas créer de documents
     */
    nouveau,

    /**
     * état d'un client qui a créé son compte et a été validé par le fournisseur ou qui a été créé par le fournisseur
     */
    actif,

    /**
     * état d'un client qui a créé son compte, qui a des données et qui va quitter le site
     * pendant un mois il peut télécharger les données de ses commandes
     */
    inactif,

    /**
     * état d'un client qui a des données et qui a quitté le site
     */
    fermé,
}

export class EtatsRole {
    static états: EtatRole[] = [EtatRole.nouveau, EtatRole.actif, EtatRole.inactif, EtatRole.fermé]

    static texte(type: EtatRole): string {
        switch (type) {
            case EtatRole.nouveau:
                return 'nouveau';
            case EtatRole.actif:
                return 'actif';
            case EtatRole.inactif:
                return 'inactif';
            case EtatRole.fermé:
                return 'fermé';
            default:
                break;
        }
    }

    static nbJoursInactifsAvantFermé = 60;
}
