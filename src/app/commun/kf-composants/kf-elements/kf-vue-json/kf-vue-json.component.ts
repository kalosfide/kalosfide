import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-vue-json',
    template: `
    <div [ngClass]="composant.classe" [ngStyle]="composant.style">
        <pre #preElement>{{ composant.texte }}</pre>
    </div>
  `,
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfVueJsonComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('preElement', {static: false}) preElement: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.preElement.nativeElement, this.output);
    }

}
