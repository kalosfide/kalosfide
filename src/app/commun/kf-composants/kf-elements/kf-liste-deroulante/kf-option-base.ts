import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase, KfTypeContenuPhrasé } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgStyle } from '../../kf-partages/kf-gere-css-style';

export interface IKfOption {
    contenuPhrase: KfContenuPhrase;
    valeur: any;
    classe: KfNgClasse;
    style: KfNgStyle;
    inactif?: boolean;
}

export abstract class KfOptionBase extends KfGéreCss implements IKfOption {
    private _contenuPhrase: KfContenuPhrase;
    inactif?: boolean;

    constructor() {
        super();
        this._contenuPhrase = new KfContenuPhrase();
    }

    public get contenuPhrase(): KfContenuPhrase { return this._contenuPhrase; }

    ajoute(contenu: KfTypeContenuPhrasé) {
        this._contenuPhrase.ajoute(contenu);
    }

    fixeTexte(texteDef: KfTexteDef) {
        this._contenuPhrase.fixeTexte(texteDef);
    }

    abstract get valeur(): any;

}
