import { Component, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { KfContenuPhrase } from './kf-contenu-phrase';
import { KfEvenement } from '../kf-evenements';
import { KfTypeDeComposant } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-contenu-phrase',
    templateUrl: './kf-contenu-phrase.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfContenuPhraseComponent implements AfterViewInit {
    @Input() contenuPhrase: KfContenuPhrase;
    @Output() output: EventEmitter<KfEvenement> = new EventEmitter();

    type = KfTypeDeComposant;

    constructor() { }

    ngAfterViewInit() {
    }

    /**
     * transmission d'un évènement à l'Angular component qui utilise le template de ce component
     */
    transmet(evenement: KfEvenement) {
        if (this.contenuPhrase.composant) {
            this.contenuPhrase.composant.gereHtml.traite(evenement);
        }
    }

}
