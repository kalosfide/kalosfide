import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfComposant } from '../kf-composant/kf-composant';

export type KfDivTableContenuDef = string | KfComposant;

export class KfDivTableColonne extends KfGéreCss {
    texte: string;
    composant: KfComposant;

    constructor(contenuDef: KfDivTableContenuDef) {
        super();
        if (typeof (contenuDef) === 'string') {
            this.texte = contenuDef;
        } else {
            this.composant = contenuDef;
        }
    }
}

export class KfDivTableLigne extends KfGéreCss {
    private _colonnes: KfDivTableColonne[] = [];

    get colonnes(): KfDivTableColonne[] { return this._colonnes; }

    /**
     * ajoute une colonne à la table et retourne cette colonne
     */
    ajoute(contenuDef: KfDivTableContenuDef): KfDivTableColonne {
        const colonne = new KfDivTableColonne(contenuDef);
        this._colonnes.push(colonne);
        return colonne;
    }
}
export class KfDivTable extends KfGéreCss {
    private _lignes: KfDivTableLigne[] = [];
    get lignes(): KfDivTableLigne[] { return this._lignes; }

    /**
     * ajoute une ligne à la table et retourne cette ligne
     */
    ajoute(): KfDivTableLigne {
        const ligne = new KfDivTableLigne();
        this._lignes.push(ligne);
        return ligne;
    }
}
