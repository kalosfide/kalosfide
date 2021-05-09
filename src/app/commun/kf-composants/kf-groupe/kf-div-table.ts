import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfComposant } from '../kf-composant/kf-composant';

export type KfDivTableContenuDef = string | KfComposant[];

export class KfDivTableColonne extends KfGéreCss {
    texte: string;
    composants: KfComposant[];

    constructor(contenuDef: KfDivTableContenuDef) {
        super();
        if (typeof (contenuDef) === 'string') {
            this.texte = contenuDef;
        } else {
            this.composants = contenuDef;
        }
    }
}

export class KfDivTableLigne extends KfGéreCss {
    private pColonnes: KfDivTableColonne[] = [];

    get colonnes(): KfDivTableColonne[] { return this.pColonnes; }

    /**
     * ajoute une colonne à la table et retourne cette colonne
     */
    ajoute(contenuDef: KfDivTableContenuDef): KfDivTableColonne {
        const colonne = new KfDivTableColonne(contenuDef);
        this.pColonnes.push(colonne);
        return colonne;
    }
}
export class KfDivTable extends KfGéreCss {
    private pLignes: KfDivTableLigne[] = [];
    get lignes(): KfDivTableLigne[] { return this.pLignes; }

    /**
     * ajoute une ligne à la table et retourne cette ligne
     */
    ajoute(): KfDivTableLigne {
        const ligne = new KfDivTableLigne();
        this.pLignes.push(ligne);
        return ligne;
    }
}
