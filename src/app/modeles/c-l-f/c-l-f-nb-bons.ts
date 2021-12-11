export class CLFNbBons {
    /**
     * Pour un bon dans une synthèse: Nombre de lignes du bon.
     * Pour une synthèse: Nombre de bons.
     */
    total?: number;
    /**
     * Pour un bon dans une synthèse: Nombre de lignes du bon où le àFixer est défini.
     * Pour une synthèse: Nombre de bons non vides dont les àFixer de toutes les lignes sont définis.
     */
    préparés?: number;
    /**
     * Pour un bon dans une synthèse: Nombre de lignes du bon où le àFixer est nul.
     * Pour une synthèse: Nombre de bons non vides dont les àFixer de toutes les lignes sont nuls.
     */
    annulés?: number;
    /**
     * Pour une synthèse: Nombre de bons sélectionnés.
     * Ces bons sont nécessairement non vides et les àFixer de toutes les lignes sont définis.
     */
    sélectionnés?: number;
    /**
     * Pour une synthèse: Nombre de bons sélectionnés qui sont annulés.
     * Ces bons sont nécessairement non vides et les àFixer de toutes les lignes sont nuls.
     */
    annulésSélectionnés?: number;

    static bilanVide(): CLFNbBons {
        return {
            total: 0,
            préparés: 0,
            annulés: 0,
            sélectionnés: 0,
            annulésSélectionnés: 0,
        };
    }
}
