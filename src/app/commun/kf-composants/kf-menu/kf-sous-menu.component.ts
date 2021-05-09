import {
    Component, OnInit, Input,
    ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfSousMenu } from './kf-sous-menu';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-sous-menu',
    templateUrl: './kf-sous-menu.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfSousMenuComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('divElement', {static: false}) divElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.divElementRef.nativeElement, this.output);
    }

    get sousMenu(): KfSousMenu {
        return this.composant as KfSousMenu;
    }

}
