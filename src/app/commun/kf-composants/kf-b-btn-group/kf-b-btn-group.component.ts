import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KFComposantService } from '../kf-composant.service';
import { KfBBtnGroup } from './kf-b-btn-group';

@Component({
    selector: 'app-kf-b-btn-group',
    templateUrl: './kf-b-btn-group.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfBBtnGroupComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    constructor(protected service: KFComposantService) {
        super(service);
    }

    get ariaLabel(): string {
        return this.composant.nom;
    }

    get bbtnGroup(): KfBBtnGroup {
        return this.composant as KfBBtnGroup;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
