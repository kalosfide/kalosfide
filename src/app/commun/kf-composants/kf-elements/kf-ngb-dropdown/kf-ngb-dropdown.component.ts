import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';
import { KfNgbDropdown } from './kf-ngb-dropdown';

@Component({
    selector: 'app-kf-ngb-dropdown',
    templateUrl: './kf-ngb-dropdown.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfNgbDropdownComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) htmlElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get ngbDropdown(): KfNgbDropdown {
        return this.composant as KfNgbDropdown;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.htmlElementRef.nativeElement, this.output);
    }

    estGroupe(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.ngbDropdownGroup;
    }

}
