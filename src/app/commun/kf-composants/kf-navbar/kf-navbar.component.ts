import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfNavbar } from './kf-navbar';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-navbar',
    templateUrl: './kf-navbar.component.html',
    styleUrls: ['../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
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
