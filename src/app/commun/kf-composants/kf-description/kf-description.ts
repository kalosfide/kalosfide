import { KfComposant } from '../kf-composant/kf-composant';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse, KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';
import { KfStringDef } from '../kf-partages/kf-string-def';

export class KfDescription {
    titre: KfComposant;
    contenu: KfComposant;
    private _géreCssTitre: KfGéreCss;
    private _géreCssContenu: KfGéreCss;

    constructor(titre: KfComposant, contenu: KfComposant) {
        this.titre = titre;
        this.contenu = contenu;
    }

    get nePasAfficher(): boolean {
        if (this._géreCssTitre) {
            return this._géreCssTitre.nePasAfficher;
        }
    }
    set nePasAfficher(valeur: boolean) {
        if (!this._géreCssTitre) {
            this._géreCssTitre = new KfGéreCss();
        }
        this._géreCssTitre.nePasAfficher = valeur;
    }

    ajouteClasseTitre(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this._géreCssTitre) {
            this._géreCssTitre = new KfGéreCss();
        }
        this._géreCssTitre.ajouteClasse(...classeDefs);
    }

    supprimeClasseTitre(...classeDefs: KfStringDef[]) {
        if (this._géreCssTitre) {
            this._géreCssTitre.supprimeClasse(...classeDefs);
        }
    }

    get classeTitre(): KfNgClasse {
        if (this._géreCssTitre) {
            return this._géreCssTitre.classe;
        }
    }

    fixeStyleTitre(nom: string, valeur: KfStringDef, active?: () => boolean) {
        if (!this._géreCssTitre) {
            this._géreCssTitre = new KfGéreCss();
        }
        this._géreCssTitre.fixeStyleDef(nom, valeur, active);
    }

    supprimeStyleTitre(nom: string) {
        if (this._géreCssTitre) {
            this._géreCssTitre.supprimeStyleDef(nom);
        }
    }

    get styleTitre(): KfNgStyle {
        if (this._géreCssTitre) {
            return this._géreCssTitre.style;
        }
    }

    ajouteClasseContenu(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this._géreCssContenu) {
            this._géreCssContenu = new KfGéreCss();
        }
        this._géreCssContenu.ajouteClasse(...classeDefs);
    }

    supprimeClasseContenu(...classeDefs: KfStringDef[]) {
        if (this._géreCssContenu) {
            this._géreCssContenu.supprimeClasse(...classeDefs);
        }
    }

    get classeContenu(): KfNgClasse {
        if (this._géreCssContenu) {
            return this._géreCssContenu.classe;
        }
    }

    fixeStyleContenu(nom: string, valeur: KfStringDef, active?: () => boolean) {
        if (!this._géreCssContenu) {
            this._géreCssContenu = new KfGéreCss();
        }
        this._géreCssContenu.fixeStyleDef(nom, valeur, active);
    }

    supprimeStyleContenu(nom: string) {
        if (this._géreCssContenu) {
            this._géreCssContenu.supprimeStyleDef(nom);
        }
    }

    get styleContenu(): KfNgStyle {
        if (this._géreCssContenu) {
            return this._géreCssContenu.style;
        }
    }
}
