import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfStringDef } from '../../kf-partages/kf-string-def';
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
    private pContenuPhrase: KfContenuPhrase;
    inactif?: boolean;

    constructor() {
        super();
        this.pContenuPhrase = new KfContenuPhrase();
    }

    public get contenuPhrase(): KfContenuPhrase { return this.pContenuPhrase; }

    ajoute(contenu: KfTypeContenuPhrasé) {
        this.pContenuPhrase.ajouteContenus(contenu);
    }

    fixeTexte(stringDef: KfStringDef) {
        this.pContenuPhrase.fixeTexte(stringDef);
    }

    abstract get valeur(): any;

}
