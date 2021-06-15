import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { Params } from '@angular/router';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfCssClasse } from '../../kf-partages/kf-css-classe';

export class KfLien extends KfComposant {

    private url: KfTexteDef;

    /**
     * # fragment de la balise Html a
     */
    fragment: string;

    queryParams?: Params | null;

    /**
     * Classe css à appliquer quand l'url du lien est préfixe de l'url de la page active du router.
     */
    private pRouterLinkActive: string;
    /**
     * Si défini
     */
     private pRouterLinkActiveOptions: { exact: true };

    constructor(nom: string,
        url?: KfTexteDef,
        texte?: KfTexteDef,
    ) {
        super(nom, KfTypeDeComposant.lien);
        this.url = url;
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);

        this.ajouteClasse({ nom: KfCssClasse.inactivé, active: () => this.inactif });
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

    /**
     * Ajoute la directive routerLinkActive au template
     * @param classe classe css à appliquer quand l'url du lien est préfixe de l'url de la page active du router.
     * @param exact Si présent et vrai, la classe routerLinkActive n'est appliquée que quand l'url du lien est l'url de la page active du router.
     */
    avecRouterLinkActive(classe?: string, exact?: boolean) {
        if (!classe) {
            classe = KfCssClasse.actif;
        }
        this.pRouterLinkActive = classe;
        if (exact === true) {
            this.pRouterLinkActiveOptions = { exact: true };
        }
    }

    get routerLinkActive(): string {
            return this.pRouterLinkActive;
    }
    get routerLinkActiveOptions(): ({ exact: true }) {
        return this.pRouterLinkActiveOptions;
    }

}
