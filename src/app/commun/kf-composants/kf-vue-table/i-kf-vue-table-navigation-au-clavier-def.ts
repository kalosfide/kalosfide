
export interface IKfVueTableNavigationAuClavierDef {
    type: 'lignes' | 'cellules';
    /**
     * Si présent et vrai et si il y a une pagination, change de page avec les touches Home, PageUp, PageDown et End
     */
    controlePagination?: boolean;

    /**
     * Si présent et vrai et si le type est 'cellules', seules les cellules dont le contenu est une entrée ou un lien
     * ou un bouton participent à la navigation.
     */
    entréesEtActionsSeulement?: boolean;

    /**
     * Classe à appliquer à l'élément tr de la ligne active ou de la ligne de la cellule active
     */
    classeLigneActive?: string;
}
