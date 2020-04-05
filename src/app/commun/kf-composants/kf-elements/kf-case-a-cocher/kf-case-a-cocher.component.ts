import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfCaseACocher } from './kf-case-a-cocher';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-caseacocher',
    templateUrl: './kf-case-a-cocher.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfCaseACocherComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef;
    @ViewChild('labelElement', {static: false}) labelElement: ElementRef;

    constructor(protected service: KFComposantService) {
        super(service);
    }
    ngOnInit() {
    }

    get case(): KfCaseACocher {
        return this.composant as KfCaseACocher;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement,
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
        };
        if (this.case.avecLabelAvant || this.case.avecLabelApres) {
            this.composant.gereHtml.enfantsDeVue.labelElement = this.labelElement.nativeElement;
        }
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
