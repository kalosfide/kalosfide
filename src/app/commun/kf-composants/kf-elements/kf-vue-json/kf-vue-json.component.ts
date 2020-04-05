import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfVueJson } from './kf-vue-json';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-vue-json',
    template: `
    <div [ngClass]="composant.classe" [ngStyle]="composant.style">
        <pre #preElement>{{ composant.texte }}</pre>
    </div>
  `,
    styleUrls: ['../../kf-composants.scss']
})
export class KfVueJsonComponent extends KfComposantComponent implements AfterViewInit {
    @ViewChild('preElement', {static: false}) preElement: ElementRef;

    constructor(protected service: KFComposantService) {
        super(service);
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.preElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            preElement: this.preElement.nativeElement,
        };
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
