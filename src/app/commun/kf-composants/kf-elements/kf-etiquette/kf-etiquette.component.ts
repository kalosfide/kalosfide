import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { KfEtiquette } from './kf-etiquette';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfBalise } from '../../kf-partages/kf-balise/kf-balise';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-etiquette',
    templateUrl: './kf-etiquette.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfEtiquetteComponent extends KfComposantComponent implements OnInit {

    private pBalise: KfBalise;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get etiquette(): KfEtiquette {
        return this.composant as KfEtiquette;
    }

    get balise(): KfBalise {
        return this.pBalise;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.etiquette.contenuPhrase;
    }

    get suiviDeSaut(): boolean {
        return this.etiquette.suiviDeSaut;
    }

    get labelFor(): string {
        return this.etiquette.labelFor;
    }

    ngOnInit() {
        if (this.etiquette.baliseHtml) {
            this.pBalise = new KfBalise();
            this.pBalise.baliseHTML = this.etiquette.baliseHtml;
            this.pBalise.contenuPhrase = this.etiquette.contenuPhrase;
            this.pBalise.suitLaVisiblité(this.etiquette);
            this.pBalise.suitClassesEtStyle(this.etiquette);
            this.pBalise.afterViewInit = (htmlElement: HTMLElement) => {
                if (htmlElement) {
                    this.composant.gereHtml.htmlElement = htmlElement;
                }
                this.composant.gereHtml.initialiseHtml(this.output);
            };
        }
    }

}
