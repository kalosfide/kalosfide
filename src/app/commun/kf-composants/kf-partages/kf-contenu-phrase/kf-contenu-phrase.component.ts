import { Component, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { KfContenuPhrase } from './kf-contenu-phrase';
import { KfEvenement } from '../kf-evenements';
import { KfTypeDeComposant } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-contenu-phrase',
    templateUrl: './kf-contenu-phrase.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfContenuPhraseComponent implements AfterViewInit {
    @Input() contenuPhrase: KfContenuPhrase;
    @Output() output: EventEmitter<KfEvenement> = new EventEmitter();

    type = KfTypeDeComposant;

    constructor() { }

    ngAfterViewInit() {
    }

}
