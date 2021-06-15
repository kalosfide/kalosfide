import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfBalise } from '../../kf-partages/kf-balise/kf-balise';
import { KfBootstrapSpinner } from './kf-bootstrap-spinner';

@Component({
    selector: 'app-kf-bootstrap-spinner',
    templateUrl: './kf-bootstrap-spinner.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfBootstrapSpinnerComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('fondHtmlElement', {static: false}) fondHtmlElement: ElementRef;

    get spinner(): KfBootstrapSpinner {
        return this.composant as KfBootstrapSpinner;
    }

    ngAfterViewInit() {
        if (this.fondHtmlElement) {
            this.spinner.fond.initialiseHtml(this.fondHtmlElement.nativeElement, this.output);
        }
    }
}
