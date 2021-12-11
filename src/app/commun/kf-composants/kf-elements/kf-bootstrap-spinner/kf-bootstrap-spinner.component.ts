import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfBootstrapSpinner } from './kf-bootstrap-spinner';

@Component({
    selector: 'app-kf-bootstrap-spinner',
    templateUrl: './kf-bootstrap-spinner.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
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
