import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfNavbar } from './kf-navbar';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-navbar',
    templateUrl: './kf-navbar.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfNavbarComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.domElementRef.nativeElement, this.output);
    }

    get navbar(): KfNavbar {
        return this.composant as KfNavbar;
    }
}
