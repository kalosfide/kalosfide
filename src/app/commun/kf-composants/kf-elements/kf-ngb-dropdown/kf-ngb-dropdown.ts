import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfBouton } from '../kf-bouton/kf-bouton';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasseDef, KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfEtiquette } from '../kf-etiquette/kf-etiquette';

type TypePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' |
    'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom';

export class KfNgbDropdown extends KfComposant {
    autoClose: boolean | 'inside' | 'outside';
    placement: TypePlacement | TypePlacement[];
    ouvert: boolean;
    private pGereCssMenu: KfGéreCss;

    // pour la classe et le contenu phrasé
    bouton: KfEtiquette;
    private pAvecBouton: boolean
    get avecBouton(): boolean {
        return this.pAvecBouton;
    }
    avecLien() {
        this.pAvecBouton = false;
    }

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, KfTypeDeComposant.ngbDropdown);
        this.ajouteClasse('dropdown');
        this.bouton = new KfEtiquette('', texte);
        this.bouton.ajouteClasse('dropdown-toggle');
        this.pAvecBouton = true;
        this.pGereCssMenu = new KfGéreCss();
        this.pGereCssMenu.ajouteClasse('dropdown-menu');
    }

    estADroiteDansMenu() {
        this.pGereCssMenu.ajouteClasse('dropdown-menu-right');
    }

    ajoute(item: KfComposant) {
        this.noeud.Ajoute(item.noeud);
        item.ajouteClasse('dropdown-item');
    }

    ajouteClasseMenu(...classeDefs: (KfStringDef | KfNgClasseDef)[]): void {
        this.pGereCssMenu.ajouteClasse(...classeDefs);
    }

    get classeMenu(): KfNgClasse {
        return this.pGereCssMenu.classe;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.bouton.contenuPhrase;
    }
}
