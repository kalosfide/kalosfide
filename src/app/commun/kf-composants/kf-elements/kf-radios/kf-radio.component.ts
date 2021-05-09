import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { KfRadios } from './kf-radios';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfRadio } from './kf-radio';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-radio',
    templateUrl: './kf-radio.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfRadioComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef;
    @ViewChild('labelElement', {static: false}) labelElement: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get radio(): KfRadio {
        return this.composant as KfRadio;
    }

    get radios(): KfRadios {
        return this.radio.radios;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.inputElement.nativeElement, this.output);
    }

}
