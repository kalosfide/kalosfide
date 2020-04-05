import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfRadios } from './kf-radios';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-radios',
    templateUrl: './kf-radios.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfRadiosComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('divElement', {static: false}) divElement: ElementRef;

    get radios(): KfRadios {
        return this.composant as KfRadios;
    }

    constructor(protected service: KFComposantService) {
        super(service);
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.divElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            divElement: this.divElement.nativeElement,
        };
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
