import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfBouton } from '../kf-bouton/kf-bouton';
import { KfLien } from '../kf-lien/kf-lien';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasseDef, KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

type TypePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' |
    'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom';

export class KfNgbDropdown extends KfElement {
    autoClose: boolean | 'inside' | 'outside';
    placement: TypePlacement | TypePlacement[];
    ouvert: boolean;
    estADroiteDansMenu: boolean;
    private _gereCssMenu: KfGéreCss;

    // pour la classe et le contenu phrasé
    bouton: KfBouton;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.ngbDropdown);
        this.ajouteClasseDef('dropdown');
        this.bouton = new KfBouton('', texte);
        this.bouton.ajouteClasseDef('btn', 'dropdown-toggle');
        this._gereCssMenu = new KfGéreCss();
        this._gereCssMenu.ajouteClasseDef('dropdown-menu', {
            nom: 'dropdown-menu-right',
            active: () => this.estADroiteDansMenu
        });
    }

    ajoute(item: KfComposant) {
        this.noeud.Ajoute(item.noeud);
        item.ajouteClasseDef('dropdown-item');
    }

    ajouteClasseMenu(...classeDefs: (KfTexteDef | KfNgClasseDef)[]): void {
        this._gereCssMenu.ajouteClasseDefArray(classeDefs);
    }

    get classeMenu(): KfNgClasse {
        return this._gereCssMenu.classe;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.bouton.contenuPhrase;
    }
}

export class KfNgbDropdownGroup extends KfElement {
    constructor(nom: string) {
        super(nom, KfTypeDeComposant.ngbDropdownGroup);
    }

    ajoute(item: KfLien) {
        this.noeud.Ajoute(item.noeud);
        item.ajouteClasseDef('dropdown-item');
    }
}
