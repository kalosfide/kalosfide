import { KfTypeDeComposant, KfTypeDeBouton } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { IKfNgbPopoverDef } from './kf-ngb-popover';
import { KfIcone } from '../kf-icone/kf-icone';
import { FANomIcone } from '../../kf-partages/kf-icone-def';
import { KfBBtnGroup } from '../../kf-b-btn-group/kf-b-btn-group';

export class KfBouton extends KfElement {
    typeDeBouton: KfTypeDeBouton;

    private _ingbPopover: IKfNgbPopoverDef;
    private _iconePopover: KfIcone;

    private _btnGroupe: KfBBtnGroup;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.bouton);
        this.typeDeBouton = KfTypeDeBouton.bouton;
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
    }

    buttonType(typeDeBouton: KfTypeDeBouton) {
        switch (typeDeBouton) {
            case KfTypeDeBouton.bouton:
                return 'button';
            case KfTypeDeBouton.retablir:
            case KfTypeDeBouton.annuler:
                return 'reset';
            case KfTypeDeBouton.soumettre:
                return 'submit';
            default:
                break;
        }
    }

    get ngbPopover(): IKfNgbPopoverDef {
        return this._ingbPopover;
    }
    set ngbPopover(ngbPopover: IKfNgbPopoverDef) {
        this._ingbPopover = ngbPopover;
        if (ngbPopover && ngbPopover.nomIcone) {
            this._iconePopover = new KfIcone('', ngbPopover.nomIcone);
            this._iconePopover.ajouteClasseDef('kf-popover-icone');
        } else {
            this._iconePopover = undefined;
        }
    }
    get iconePopover(): KfIcone {
        return this._iconePopover;
    }
    set nomIconePopover(nomIcone: FANomIcone) {
    }

    get contenuAAfficher(): KfContenuPhrase {
        if (this._iconePopover) {
            const àAfficher = new KfContenuPhrase();
            àAfficher.contenus = this.contenuPhrase.contenus.concat([this._iconePopover]);
            return àAfficher;
        } else {
            return this.contenuPhrase;
        }
    }

    dansBtnGroup(btnGroupe: KfBBtnGroup) {
        this._btnGroupe = btnGroupe;
    }
    get btnGroupe(): KfBBtnGroup {
        return this._btnGroupe;
    }
}
