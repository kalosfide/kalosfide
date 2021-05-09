import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfGroupe } from './kf-groupe';
import { FormGroup } from '@angular/forms';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-groupe',
    templateUrl: './kf-groupe.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfGroupeComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    type = KfTypeDeComposant;
    typeDeValeur = KfTypeDeValeur;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get groupe(): KfGroupe {
        return this.composant as KfGroupe;
    }

    get formGroup(): FormGroup {
        return (this.composant as KfGroupe).formGroup;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.domElementRef.nativeElement, this.output);
    }

}
