import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KfComposant } from './kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

export interface IKfComponent {
    composant: KfComposant;
    output: EventEmitter<KfEvenement>
}

@Component({
    selector: 'app-kf-composant',
    templateUrl: './kf-composant.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfComposantComponent implements IKfComponent, OnInit {
    @Input() composant: KfComposant;

    /**
     * permet de transmettre des évènements aux Angular components dont le template utilise des templates de KfComposantComponent
     * <app-kf-xxx [composant]="composant" (output)="fncTraite($event)"></app-kf-xxx>
     */
    @Output() output: EventEmitter<KfEvenement> = new EventEmitter();

    type = KfTypeDeComposant;

    constructor(protected service: TraiteKeydownService) {
    }

    ngOnInit() {
        this.composant.traiteKeydownService = this.service;
    }

}
