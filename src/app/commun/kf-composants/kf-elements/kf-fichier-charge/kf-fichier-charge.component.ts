import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfFichierCharge } from './kf-fichier-charge';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-fichier-charge',
    template: `
    <app-kf-fichier [composant]="fichier"></app-kf-fichier>
`,
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfFichierChargeComponent extends KfComposantComponent implements OnInit, AfterViewInit {

    texte: string;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get fichier(): KfFichierCharge { return this.composant as KfFichierCharge; }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

}
