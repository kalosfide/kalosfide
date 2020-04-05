import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KFComposantService } from '../../kf-composant.service';
import { KfListeDeroulanteBase } from './kf-liste-deroulante-base';

@Component({
    selector: 'app-kf-liste-deroulante',
    templateUrl: './kf-liste-deroulante.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfListeDeroulanteComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('selectElement', {static: false}) selectElementRef: ElementRef;
    @ViewChildren('optionElement') optionElements: QueryList<ElementRef>;

    constructor(protected service: KFComposantService) {
        super(service);
    }

    get liste(): KfListeDeroulanteBase {
        return this.composant as KfListeDeroulanteBase;
    }

    get test(): any {
        const test: any = {};
        console.log(test);
        return 'test';
    }

    get selectElement(): HTMLSelectElement {
        return this.selectElementRef.nativeElement as HTMLSelectElement;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.selectElement;
        this.composant.gereHtml.enfantsDeVue = {
            selectElement: this.selectElement,
        };
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
