import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { Params } from '@angular/router';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfLien extends KfElement {

    private _url: KfTexteDef;
    private _params: any;

    fragment: string;

    queryParams?: Params | null;

    routerLinkActive: boolean;

    constructor(nom: string,
                url?: KfTexteDef,
                texte?: KfTexteDef,
    ) {
        super(nom, KfTypeDeComposant.lien);
        this._url = url;
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);

        this.ajouteClasseDef({ nom: 'disabled', active: () => this.inactif });
    }

    get url(): string {
        if (this._url) {
            return ValeurTexteDef(this._url);
        }
    }

    get route(): any {
        if (this._url) {
            if (typeof(this._url) !== 'string') {
//                console.log(this.nom, this.texte);
        }
            const route: any[] = [this.url];
            if (this._params) {
                route.push(this._params);
            }
            return route;
        }
    }

    fixeRoute(url: KfTexteDef, params?: any) {
        this._url = url;
        this._params = params;
    }

}
