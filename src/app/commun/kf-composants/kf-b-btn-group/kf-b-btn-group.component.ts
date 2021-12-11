import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';
import { KfBBtnGroup } from './kf-b-btn-group';
import { KfTypeDeComposant } from '../kf-composants-types';

@Component({
    selector: 'app-kf-b-btn-group',
    templateUrl: './kf-b-btn-group.component.html',
    styleUrls: ['../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfBBtnGroupComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    type = KfTypeDeComposant;

    constructor(protected service: TraiteKeydownService) {
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
        const divElement = this.domElementRef.nativeElement as HTMLDivElement;
        this.composant.initialiseHtml(divElement, this.output);
        if (this.bbtnGroup.estNonVide) {
            this.bbtnGroup.initialiseHtmlContenus(divElement);
        }
    }

}
