import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfDescriptions } from './kf-descriptions';

@Component({
    selector: 'app-kf-description',
    templateUrl: './kf-description.component.html',
    styleUrls: ['../kf-composants.scss']
})

export class KfDescriptionsComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    get descriptions(): KfDescriptions {
        return this.composant as KfDescriptions;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.domElementRef.nativeElement, this.output);
    }
}
