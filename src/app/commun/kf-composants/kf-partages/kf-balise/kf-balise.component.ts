import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfBalise } from './kf-balise';
import { KfTypeDeBaliseHTML } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-balise',
    templateUrl: './kf-balise.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfBaliseComponent implements OnInit, AfterViewInit {
    @Input() balise: KfBalise;
    @ViewChild('baliseElement', {static: false}) baliseElement: ElementRef;

    // pour le switch
    typeDeBalise = KfTypeDeBaliseHTML;

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.baliseElement) {
            this.balise.afterViewInit(this.baliseElement.nativeElement);
        }
    }

}
