import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfLien } from './kf-lien';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-lien',
    templateUrl: 'kf-lien.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfLienComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement', {static: false}) baliseElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get lien(): KfLien {
        return this.composant as KfLien;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.baliseElementRef.nativeElement, this.output);
    }

}
