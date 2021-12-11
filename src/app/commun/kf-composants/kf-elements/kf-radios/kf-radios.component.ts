import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfRadios } from './kf-radios';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-radios',
    templateUrl: './kf-radios.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfRadiosComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('divElement', {static: false}) divElement: ElementRef;

    get radios(): KfRadios {
        return this.composant as KfRadios;
    }

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.divElement.nativeElement, this.output);
    }

}
