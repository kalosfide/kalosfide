import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { KfRadios } from './kf-radios';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfRadio } from './kf-radio';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-radio',
    templateUrl: './kf-radio.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfRadioComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef;
    @ViewChild('labelElement', {static: false}) labelElement: ElementRef;

    constructor(protected service: KFComposantService) {
        super(service);
    }

    get radio(): KfRadio {
        return this.composant as KfRadio;
    }

    get radios(): KfRadios {
        return this.radio.radios;
    }

    get classe(): string {
        return 'form-check-input'
            + (!this.composant.contenuPhrase ? 'position-static' : '')
            + this.composant.classe;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement,
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
            labelElement: this.labelElement.nativeElement,
        };
        this.composant.gereHtml.initialiseHtml(this.output);
/*
        let i = 0;
        (this.composant as KfRadios).enfants.forEach(
            radio => {
                const r = (radio as KfRadio)
                r.enfantsDeVue = {
                   this.composant.htmlElement = r.inputElement.nativeElement),
                    inputElement: r.inputElement.nativeElement),
                    labelElement: r.labelElement.nativeElement),
                };
                i++;
            }
        );
*/
    }

}
