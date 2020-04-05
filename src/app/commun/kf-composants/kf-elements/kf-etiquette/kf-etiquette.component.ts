import { Component, OnInit } from '@angular/core';
import { KfEtiquette } from './kf-etiquette';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfBalise } from '../../kf-partages/kf-balise/kf-balise';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-etiquette',
    templateUrl: './kf-etiquette.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfEtiquetteComponent extends KfComposantComponent implements OnInit {

    private _balise: KfBalise;

    constructor(protected service: KFComposantService) {
        super(service);
    }

    get etiquette(): KfEtiquette {
        return this.composant as KfEtiquette;
    }

    get balise(): KfBalise {
        return this._balise;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.etiquette.contenuPhrase;
    }

    get suiviDeSaut(): boolean {
        return this.etiquette.suiviDeSaut;
    }

    ngOnInit() {
        if (this.etiquette.baliseHtml) {
            this._balise = new KfBalise();
            this._balise.baliseHTML = this.etiquette.baliseHtml;
            this._balise.contenuPhrase = this.etiquette.contenuPhrase;
            this._balise.suitLaVisiblité(this.etiquette);
            this._balise.suitClassesEtStyle(this.etiquette);
            this._balise.afterViewInit = (htmlElement: HTMLElement) => {
                if (htmlElement) {
                    this.composant.gereHtml.htmlElement = htmlElement;
                }
                this.composant.gereHtml.initialiseHtml(this.output);
            };
        }
    }

}
