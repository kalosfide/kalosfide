import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

export class KfUlComposant extends KfComposant {
    items: KfComposant[];
    private pGereCssLi: KfGéreCss;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.ul);
        this.items = [];
    }

    /**
     * surcharge de KfComposant. On ne peut pas utiliser l'arbre des composants contenus
     * @param composant contenu d'un li
     */
    ajoute(composant: KfComposant) {
        this.items.push(composant);
    }

    get contenus(): KfComposant[] {
        return this.items;
    }
    set contenus(composants: KfComposant[]) {
        this.items = composants;
    }

    get gereCssLi(): KfGéreCss {
        if (!this.pGereCssLi) {
            this.pGereCssLi = new KfGéreCss();
        }
        return this.pGereCssLi;
    }

    get classeLi(): KfNgClasse {
        if (this.pGereCssLi) {
            return this.pGereCssLi.classe;
        }
    }
    get styleLi(): KfNgStyle {
        if (this.pGereCssLi) {
            return this.pGereCssLi.style;
        }
    }

    get contenusAAfficher(): KfComposant[] {
        return this.contenus.filter(c => c.visible && !c.nePasAfficher);
    }

}
