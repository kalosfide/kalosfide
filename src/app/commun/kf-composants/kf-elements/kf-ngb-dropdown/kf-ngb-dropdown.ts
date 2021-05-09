import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfBouton } from '../kf-bouton/kf-bouton';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasseDef, KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

type TypePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' |
    'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom';

export class KfNgbDropdown extends KfComposant {
    autoClose: boolean | 'inside' | 'outside';
    placement: TypePlacement | TypePlacement[];
    ouvert: boolean;
    estADroiteDansMenu: boolean;
    private pGereCssMenu: KfGéreCss;

    // pour la classe et le contenu phrasé
    bouton: KfBouton;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.ngbDropdown);
        this.ajouteClasse('dropdown');
        this.bouton = new KfBouton('', texte);
        this.bouton.ajouteClasse('btn', 'dropdown-toggle');
        this.pGereCssMenu = new KfGéreCss();
        this.pGereCssMenu.ajouteClasse('dropdown-menu', {
            nom: 'dropdown-menu-right',
            active: () => this.estADroiteDansMenu
        });
    }

    ajoute(item: KfComposant) {
        this.noeud.Ajoute(item.noeud);
        item.ajouteClasse('dropdown-item');
    }

    ajouteClasseMenu(...classeDefs: (KfTexteDef | KfNgClasseDef)[]): void {
        this.pGereCssMenu.ajouteClasse(...classeDefs);
    }

    get classeMenu(): KfNgClasse {
        return this.pGereCssMenu.classe;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.bouton.contenuPhrase;
    }
}
