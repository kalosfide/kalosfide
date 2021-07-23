import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfUlComposant } from './kf-ul-ol-composant';

@Component({
    selector: 'app-kf-ul-ol',
    templateUrl: './kf-ul-ol.component.html',
    styleUrls: ['../kf-composants.scss']
})

export class KfUlOlComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    get ul(): KfUlComposant {
        return this.composant as KfUlComposant;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.domElementRef.nativeElement, this.output);
    }
}
