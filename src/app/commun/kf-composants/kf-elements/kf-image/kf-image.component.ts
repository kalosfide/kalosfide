import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfImage } from './kf-image';

@Component({
    selector: 'app-kf-image',
    templateUrl: './kf-image.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfImageComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('imgElement', {static: false}) imgElement: ElementRef;

    get image(): KfImage {
        return this.composant as KfImage;
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.imgElement.nativeElement, this.output);
    }
}
