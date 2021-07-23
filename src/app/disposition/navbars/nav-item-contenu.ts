import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { KfContenuPhrase } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfImageDef } from 'src/app/commun/kf-composants/kf-partages/kf-image-def';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { NavBar } from './navbar';
import { NavItem } from './nav-item';
import { NavItemDropdown } from './nav-item-dropdown';
import { NavItemDropDownGroup } from './nav-item-dropdown-group';
import { NavItemUlLi } from './nav-item-ul-li';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfTypeDeComposant } from 'src/app/commun/kf-composants/kf-composants-types';

export class NavItemContenu extends NavItem {
    protected pComposant: KfComposant;

    constructor(nom: string,
                parent: NavBar | NavItemDropdown | NavItemDropDownGroup | NavItemUlLi,
                composant: KfComposant
    ) {
        super(nom, parent);
        this.pComposant = composant;
    }

    fermeQuandClick() {
        this.pComposant.gereHtml.fixeAttribut('data-toggle', 'collapse');
        this.pComposant.gereHtml.fixeAttribut('data-target', '#' + this.navBar.idContenu);
    }

    get composant(): KfComposant {
        return this.pComposant;
    }

    set texte(texte: KfStringDef) {
        this.pComposant.fixeTexte(texte);
    }

    set image(image: KfImageDef) {
        this.pComposant.fixeImage(image);
    }

    set icone(icone: IKfIconeDef) {
        this.pComposant.fixeIcone(icone);
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.pComposant.contenuPhrase;
    }

    /** */

    get lien(): KfLien {
        if (this.pComposant.type === KfTypeDeComposant.lien) {
            return this.pComposant as KfLien;
        }
    }

    set url(url: KfStringDef) {
        if (this.pComposant.type === KfTypeDeComposant.lien) {
            (this.pComposant as KfLien).fixeRoute(url);
        }
    }
}
