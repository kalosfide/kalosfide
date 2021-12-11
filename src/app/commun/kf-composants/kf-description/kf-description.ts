import { KfComposant } from '../kf-composant/kf-composant';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

export class KfDescriptionItem extends KfGéreCss {
    composant: KfComposant;
    texte: string;

    constructor(stringOucomposant: string | KfComposant) {
        super();
        if (typeof(stringOucomposant) === 'string') {
            this.texte = stringOucomposant
        } else {
            this.composant = stringOucomposant;
        }
    }
}

export class KfDescription {
    /**
     * Nom de la description
     */
    nom: string;
    /**
     * Contenus des éléments html dt
     */
    titres: KfDescriptionItem[];
    /**
     * Contenus des éléments html dd
     */
    details: KfDescriptionItem[];
    /**
     * Si présent, un élément html div contient les éléments html dt et dd
     */
    private _géreCssDiv: KfGéreCss;

    constructor(nom?: string) {
        this.nom = nom;
        this.titres = [];
        this.details = [];
    }

    /**
     * Ajoute un élément html div contenant les éléments html dt et dd
     */
    créeDiv() {
        this._géreCssDiv = new KfGéreCss();
    }
 
    /**
     * Ajoute un élément html div contenant les éléments html dt et dd
     */
    get dansDiv(): boolean {
        return this._géreCssDiv !== undefined;
    }
   /**
     * Gére le ccs d'un élément html div contenant les éléments html dt et dd.
     * Doit être créé par la méthode dansDiv.
     */
    get géreCssDiv(): KfGéreCss {
        return this._géreCssDiv;
    }

    get classeDiv(): KfNgClasse {
        if (this._géreCssDiv) {
            return this._géreCssDiv.classe;
        }
    }

    get styleDiv(): KfNgStyle {
        if (this._géreCssDiv) {
            return this._géreCssDiv.style;
        }
    }

    /**
     * Ajoute un élément html dt
     * @param titre contenu de l'élément html à ajouter
     * @returns un GéreCss de l'élément html ajouté
     */
    ajouteTitre(titre: string | KfComposant): KfDescriptionItem {
        const item = new KfDescriptionItem(titre);
        this.titres.push(item);
        return item;
    }

    /**
     * Ajoute un élément html dd
     * @param détail contenu de l'élément html à ajouter
     * @returns un GéreCss de l'élément html ajouté
     */
    ajouteDétail(détail: string | KfComposant): KfDescriptionItem {
        const item = new KfDescriptionItem(détail);
        this.details.push(item);
        return item;
    }
}
