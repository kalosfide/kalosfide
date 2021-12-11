import { EventEmitter } from '@angular/core';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfEvenement } from '../kf-partages/kf-evenements';
import { KfDescription } from './kf-description';

export class KfDescriptions extends KfComposant {
    descriptions: KfDescription[]

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.description);
        this.descriptions = [];
    }

    /**
     * surcharge de KfComposant. On ne peut pas utiliser l'arbre des composants contenus
     * @param composant contenu d'un li
     */
    ajoute(composant: KfComposant) {
        return;
    }

    ajouteDescription(nom?: string): KfDescription {
        const description = new KfDescription(nom);
        this.descriptions.push(description)
        return description;
    }

    initialiseHtml(htmlElement: HTMLElement, output: EventEmitter<KfEvenement>) {
        this.gereHtml.htmlElement = htmlElement;
        this.gereHtml.initialiseHtml(output);
    }

}
