export class CLFBilan {
    /**
     * Pour un bon dans une synthèse: Nombre de lignes du bon.
     * Pour une synthèse: Nombre de bons.
     */
    nbAPréparer?: number;
    /**
     * Pour un bon dans une synthèse: Nombre de lignes du bon où le àFixer est défini.
     * Pour une synthèse: Nombre de bons non vides dont les àFixer de toutes les lignes sont définis.
     */
    nbPréparés?: number;
    /**
     * Pour un bon dans une synthèse: Nombre de lignes du bon où le àFixer est nul.
     * Pour une synthèse: Nombre de bons non vides dont les àFixer de toutes les lignes sont nuls.
     */
    nbAnnulés?: number;
    /**
     * Pour une synthèse: Nombre de bons sélectionnés.
     * Ces bons sont nécessairement non vides et les àFixer de toutes les lignes sont définis.
     */
    nbSélectionnés?: number;
    /**
     * Pour une synthèse: Nombre de bons sélectionnés qui sont annulés.
     * Ces bons sont nécessairement non vides et les àFixer de toutes les lignes sont nuls.
     */
    nbAnnulésSélectionnés?: number;

    static bilanVide(): CLFBilan {
        return {
            nbAPréparer: 0,
            nbPréparés: 0,
            nbAnnulés: 0,
            nbSélectionnés: 0,
            nbAnnulésSélectionnés: 0,
        };
    }
}
