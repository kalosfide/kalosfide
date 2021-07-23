import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfCaseACocher } from './kf-case-a-cocher';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-caseacocher',
    templateUrl: './kf-case-a-cocher.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfCaseACocherComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef;
    @ViewChild('labelElement', {static: false}) labelElement: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    ngOnInit() {
    }

    get case(): KfCaseACocher {
        return this.composant as KfCaseACocher;
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.inputElement.nativeElement, this.output);
        if (this.labelElement) {
            this.case.label.initialiseHtml(this.labelElement.nativeElement, this.output);
        }
    }

}
