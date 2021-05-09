import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { Params } from '@angular/router';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfLien extends KfComposant {

    private url: KfTexteDef;

    /**
     * # fragment de la balise Html a
     */
    fragment: string;

    queryParams?: Params | null;

    routerLinkActive: boolean;

    constructor(nom: string,
                url?: KfTexteDef,
                texte?: KfTexteDef,
    ) {
        super(nom, KfTypeDeComposant.lien);
        this.url = url;
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);

        this.ajouteClasse({ nom: 'disabled', active: () => this.inactif });
    }

    get route(): any {
        if (this.url) {
            return ValeurTexteDef(this.url);
        }
    }

    fixeRoute(url: KfTexteDef, params?: Params) {
        this.url = url;
        this.queryParams = params;
    }

}
