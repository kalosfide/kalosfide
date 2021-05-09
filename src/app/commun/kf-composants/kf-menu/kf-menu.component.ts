import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';
import { KfMenu } from './kf-menu';

@Component({
    selector: 'app-kf-menu',
    template: `
    <div #divElement [ngClass]="menu.classe" [ngStyle]="menu.style">
        <app-kf-sous-menu *ngFor="let sousMenu of menu.sousMenus"
            [composant]="sousMenu"></app-kf-sous-menu>
    </div>
`,
    styleUrls: ['../kf-composants.scss']
})
export class KfMenuComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('divElement', {static: false}) divElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get menu(): KfMenu {
        return this.composant as KfMenu;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.divElementRef.nativeElement, this.output);
    }

}
