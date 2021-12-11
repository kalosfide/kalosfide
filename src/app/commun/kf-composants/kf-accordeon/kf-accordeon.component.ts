import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';
import { KfAccordeon } from './kf-accordeon';

@Component({
    selector: 'app-kf-accordeon',
    templateUrl: './kf-accordeon.component.html',
    styleUrls: ['../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfAccordeonComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get ariaLabel(): string {
        return this.composant.nom;
    }

    get accordeon(): KfAccordeon {
        return this.composant as KfAccordeon;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const divElement = this.domElementRef.nativeElement as HTMLDivElement;
        this.composant.initialiseHtml(divElement, this.output);
        this.accordeon.initialiseHtmlContenus(divElement);
    }

}
