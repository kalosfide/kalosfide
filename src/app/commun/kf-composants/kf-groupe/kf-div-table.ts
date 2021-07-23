import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfGroupe } from './kf-groupe';
import { KfNgClasse, KfNgClasseCombine } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

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

export class KfDivTableLigne {
    private pColonnes: KfDivTableColonne[] = [];

    get colonnes(): KfDivTableColonne[] { return this.pColonnes; }

    private pGéreCss: KfGéreCss;

    constructor(groupe?: KfGroupe) {
        this.pGéreCss = groupe ? groupe : new KfGéreCss;
    }

    /**
     * Ajoute une colonne à la table et retourne cette colonne
     * @param contenuDef string | KfComposant[]
     */
    ajoute(contenuDef: KfDivTableContenuDef): KfDivTableColonne {
        const colonne = new KfDivTableColonne(contenuDef);
        this.pColonnes.push(colonne);
        return colonne;
    }

    get géreCss(): KfGéreCss {
        return this.pGéreCss;
    }
    get classe(): KfNgClasse {
        return this.pGéreCss.classe;
    }
    get style(): KfNgStyle {
        return this.pGéreCss.style;
    }
    get nePasAfficher(): boolean {
        return this.pGéreCss.nePasAfficher;
    }
}
export class KfDivTable {
    private pLignes: KfDivTableLigne[] = [];
    get lignes(): KfDivTableLigne[] { return this.pLignes; }

    private pGroupe: KfGroupe;

    constructor(groupe: KfGroupe) {
        this.pGroupe = groupe;
    }

    /**
     * ajoute une ligne à la table et retourne cette ligne
     */
    ajoute(): KfDivTableLigne {
        const ligne = new KfDivTableLigne();
        this.pLignes.push(ligne);
        return ligne;
    }

    get classe(): KfNgClasse {
        return this.pGroupe.classe;
    }
    get style(): KfNgStyle {
        return this.pGroupe.style;
    }
}
