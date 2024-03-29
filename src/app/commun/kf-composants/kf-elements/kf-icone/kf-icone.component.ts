import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfIcone } from './kf-icone';

@Component({
    selector: 'app-kf-icone',
    templateUrl: './kf-icone.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfIconeComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) htmlElement: ElementRef;
    @ViewChild('fondHtmlElement', {static: false}) fondHtmlElement: ElementRef;

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.htmlElement) {
            this.composant.initialiseHtml(this.htmlElement.nativeElement, this.output);
        }
        if (this.fondHtmlElement) {
            this.icone.fond.initialiseHtml(this.fondHtmlElement.nativeElement, this.output);
        }
    }

    get icone(): KfIcone {
        return this.composant as KfIcone;
    }
    get item() {
        const icone = this.composant as KfIcone;
        if (icone.couches) {
            return icone.couches[0];
        }
    }
}
