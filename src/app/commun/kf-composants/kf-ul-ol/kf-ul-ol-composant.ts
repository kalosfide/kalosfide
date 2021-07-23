import { EventEmitter } from '@angular/core';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfEvenement } from '../kf-partages/kf-evenements';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

class KfLiComposant extends KfComposant {
    constructor(ul: KfUlComposant, index: number, contenu: KfComposant) {
        super(ul.nom + 'li' + (index + 1), KfTypeDeComposant.li);
        this.ajoute(contenu);
    }

    ajoute(composant: KfComposant) {
        if (this.noeud.enfant) {
            throw new Error(`On ne peut pas ajouter à un li déjà créé: ${this.nom}`);
        }
        this.noeud.Ajoute(composant.noeud);
    }

    get item(): KfComposant {
        return this.contenus[0];
    }
}

export class KfUlComposant extends KfComposant {
    lis: KfLiComposant[];
    nav: KfGroupe;
    items: KfComposant[];
    private pGereCssLi: KfGéreCss;

    constructor(nom: string, dansNav?: boolean) {
        super(nom, KfTypeDeComposant.ulol);
        this.lis = [];
        this.items = [];
    }

    get dansNav(): boolean {
        return this.nav !== undefined;
    }

    get géreCssNav(): KfGéreCss {
        if (!this.nav) {
            this.nav = new KfGroupe(this.nom + '_nav');
        }
        return this.nav;
    }

    fixeAttributNav(nom: string, valeur?: string) {
        if (!this.nav) {
            this.nav = new KfGroupe(this.nom + '_nav');
        }
        this.nav.gereHtml.fixeAttribut(nom, valeur);
    }

    get classeNav(): KfNgClasse {
        if (this.nav) {
            return this.nav.classe;
        }
    }

    get styleNav(): KfNgStyle {
        if (this.nav) {
            return this.nav.style;
        }
    }

    /**
     * surcharge de KfComposant. On ne peut pas utiliser l'arbre des composants contenus
     * @param composant contenu d'un li
     */
    ajoute(composant: KfComposant) {
        const li = new KfLiComposant(this, this.lis.length, composant);
        this.lis.push(li);
        this.items.push(composant);
    }

    get contenus(): KfComposant[] {
        return this.items;
    }
    set contenus(composants: KfComposant[]) {
        this.lis = [];
        composants.forEach(c => this.ajoute(c));
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

    get contenusAAfficher(): {
        premiers: KfComposant[],
        dernier?: KfComposant
    } {
        const contenus = this.contenus.filter(c => c.visible && !c.nePasAfficher);
        if (this.dansNav) {
            const dernier = contenus.pop();
            return {
                premiers: contenus,
                dernier
            }
        }
        return {
            premiers: contenus
        }
    }

    initialiseHtmlLis(htmlElements: HTMLCollection, output: EventEmitter<KfEvenement>) {
        for (let index = 0; index < this.lis.length; index++) {
            const li = this.lis[index];
            const liElement = htmlElements[index];
            li.initialiseHtml(liElement as HTMLElement, output);
        }
    }

    initialiseHtml(htmlElement: HTMLElement, output: EventEmitter<KfEvenement>) {
        this.gereHtml.htmlElement = htmlElement;
        this.gereHtml.initialiseHtml(output);
        this.initialiseHtmlLis(htmlElement.children, output);
    }

}
