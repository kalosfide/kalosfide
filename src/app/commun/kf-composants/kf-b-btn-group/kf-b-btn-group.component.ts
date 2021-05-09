import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';
import { KfBBtnGroup } from './kf-b-btn-group';

@Component({
    selector: 'app-kf-b-btn-group',
    templateUrl: './kf-b-btn-group.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfBBtnGroupComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

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
        for (let index = 0; index < this.bbtnGroup.contenus.length; index++) {
            const composant = this.bbtnGroup.contenus[index];
            const htmlElement = divElement.children[index] as HTMLElement;
            composant.initialiseHtml(htmlElement, null);
        }
    }

}
