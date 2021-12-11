import { KfComposant } from "../kf-composant/kf-composant";
import { KfTypeDeComposant } from "../kf-composants-types";
import { KfBouton } from "../kf-elements/kf-bouton/kf-bouton";
import { KfAccordeonItem } from "./kf-accordeon-item";

export interface IKfAccordeonClasse {
    accordeon: string;
    item: string;
    enTête: string;
    bouton: string;
    fermable: string;
    corps: string;
    /**
     * Classe css à ajouter au bouton quand l'item est fermé.
     */
    boutonFermé: string;
    /**
     * Classe css à ajouter au corps quand l'item est ouvert.
     */
    fermableOuvert: string;
}

export interface IKfAccordeonDef {
    /**
     * Si présent et vrai, le premier item est fermé à la création.
     */
    premierItemFermé?: boolean;

    /**
     * Si absent ou faux, l'ouverture d'un item déclenche la fermeture des autres. 
     */
    plusieursOuverts?: boolean;

    classe: IKfAccordeonClasse;
}

export class KfAccordeon extends KfComposant {
    items: KfAccordeonItem[];
    def: IKfAccordeonDef;

    constructor(nom: string, def?: IKfAccordeonDef) {
        super(nom, KfTypeDeComposant.accordeon);
        this.def = def ? def : { classe: KfAccordeon.bootstrapClasse };
        this.ajouteClasse(this.def.classe.accordeon);
        this.items = [];
    }

    static get bootstrapClasse(): IKfAccordeonClasse {
        return {
                accordeon: 'accordion',
                item: 'accordion-item',
                enTête: 'accordion-header',
                bouton: 'accordion-button',
                fermable: 'accordion-collapse collapse',
                corps: 'accordion-body',
                boutonFermé: 'collapsed',
                fermableOuvert: 'show'
            };
    }

    ajoute(composant: KfComposant) {
        throw new Error('On ne peut pas ajouter de KfComposant à un KfAccordeon.')
    }

    ajouteItem(bouton: KfBouton, ...contenus: KfComposant[]): KfAccordeonItem {
        this.noeud.Ajoute(bouton.noeud);
        contenus.forEach(composant => {
            this.noeud.Ajoute(composant.noeud);
        });
        const no = this.items.length + 1;
        const item = new KfAccordeonItem(this, no, bouton, contenus);
        item.ouvert = no === 1 && !this.def.premierItemFermé;
        this.items.push(item);
        return item;
    }

    quandClic(no: number) {
        const item = this.items[no - 1];
        if (item.ouvert) {
            item.ouvert = false;
        } else {
            item.ouvert = true;
            if (!this.def.plusieursOuverts) {
                for (const i of this.items) {
                    if (i.no !== no && i.ouvert) {
                        i.ouvert = false
                    }
                }
            }
        }
    }

    initialiseHtmlContenus(divElement: HTMLDivElement) {
        for (let index = 0; index < this.items.length; index++) {
            const item = this.items[index];
            const itemDivElement = divElement.children[index] as HTMLDivElement;
            const enTeteDivElement = itemDivElement.children[0] as HTMLDivElement;
            item.bouton.initialiseHtml(enTeteDivElement.children[0] as HTMLElement);
        }
    }
}