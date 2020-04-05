import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfNavbar } from './kf-navbar';
import { KFComposantService } from '../kf-composant.service';

@Component({
    selector: 'app-kf-navbar',
    templateUrl: './kf-navbar.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfNavbarComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    constructor(protected service: KFComposantService) {
        super(service);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

    get navbar(): KfNavbar {
        return this.composant as KfNavbar;
    }
}
