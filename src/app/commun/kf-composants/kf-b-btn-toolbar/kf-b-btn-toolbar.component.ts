import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';
import { KfBBtnToolbar } from './kf-b-btn-toolbar';

@Component({
    selector: 'app-kf-b-btn-toolbar',
    templateUrl: './kf-b-btn-toolbar.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfBBtnToolbarComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get ariaLabel(): string {
        return this.composant.nom;
    }

    get bbtnToolbar(): KfBBtnToolbar {
        return this.composant as KfBBtnToolbar;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.domElementRef.nativeElement, this.output);
    }

}
