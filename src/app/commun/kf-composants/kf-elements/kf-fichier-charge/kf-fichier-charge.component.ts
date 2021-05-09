import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfFichierCharge, KfResultatFichierCharge } from './kf-fichier-charge';
import { KfEvenement, KfTypeDEvenement } from '../../kf-partages/kf-evenements';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';
import { litFichierTexte } from 'src/app/commun/outils/lit-fichier-texte';

@Component({
    selector: 'app-kf-fichier-charge',
    template: `
    <app-kf-fichier [composant]="fichier"></app-kf-fichier>
`,
    styleUrls: ['../../kf-composants.scss']
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
