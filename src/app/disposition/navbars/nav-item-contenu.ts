import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { KfContenuPhrase } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfImageDef } from 'src/app/commun/kf-composants/kf-partages/kf-image-def';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { NavBar } from './navbar';
import { NavItem } from './nav-item';
import { NavItemDropdown } from './nav-item-dropdown';
import { NavItemDropDownGroup } from './nav-item-dropdown-group';
import { NavItemUlLi } from './nav-item-ul-li';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfTypeDeComposant } from 'src/app/commun/kf-composants/kf-composants-types';

export class NavItemContenu extends NavItem {
    protected _composant: KfComposant;

    constructor(nom: string,
        parent: NavBar | NavItemDropdown | NavItemDropDownGroup | NavItemUlLi,
        composant: KfComposant
    ) {
        super(nom, parent);
        this._composant = composant;
    }

    fermeQuandClick() {
        this._composant.gereHtml.fixeAttribut('data-toggle', 'collapse');
        this._composant.gereHtml.fixeAttribut('data-target', '#' + this.navBar.idContenu);
    }

    get composant(): KfComposant {
        return this._composant;
    }

    set texte(texte: KfTexteDef) {
        this._composant.fixeTexte(texte);
    }

    set image(image: KfImageDef) {
        this._composant.fixeImage(image);
    }

    set icone(icone: FANomIcone) {
        this._composant.fixeIcone(icone);
    }

    get contenuPhrase(): KfContenuPhrase {
        return this._composant.contenuPhrase;
    }

    /** */

    get lien(): KfLien {
        if (this._composant.type === KfTypeDeComposant.lien) {
            return this._composant as KfLien;
        }
    }

    set url(url: KfTexteDef) {
        if (this._composant.type === KfTypeDeComposant.lien) {
            (this._composant as KfLien).fixeRoute(url);
        }
    }
}
