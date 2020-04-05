import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfNgClasseDef, KfNgClasse } from '../kf-partages/kf-gere-css-classe';

export interface IKfNgbModalDef {
    titre: string;
    corps?: KfGroupe;
    boutonOk?: KfBouton;
    /**
     * les boutons doivent avoir des noms différents entre eux et différent de ngbModalCroix
     */
    boutonsDontOk?: KfBouton[];
    options?: NgbModalOptions;
}

export class KfNgbModal {
    private pDef: IKfNgbModalDef;
    private pGéreCssEnTête: KfGéreCss;
    private pGéreCssCroix: KfGéreCss;
    private pGéreCssCorps: KfGéreCss;
    private pGéreCssPied: KfGéreCss;

    private pOptions: NgbModalOptions;

    constructor(def: IKfNgbModalDef) {
        this.pDef = def;
        this.pOptions = {};
    }

    get titre(): string { return this.pDef.titre; }
    get corps(): KfGroupe { return this.pDef.corps; }
    get boutonOk(): KfBouton { return this.pDef.boutonOk; }
    get boutons(): KfBouton[] {
        return this.pDef.boutonsDontOk ? this.pDef.boutonsDontOk : this.pDef.boutonOk ? [this.pDef.boutonOk] : undefined;
    }
    get options(): NgbModalOptions { return this.pOptions; }

    ajouteClasseEnTête(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssEnTête) {
            this.pGéreCssEnTête = new KfGéreCss();
        }
        this.pGéreCssEnTête.ajouteClasseDefArray(classeDefs);
    }

    get classeEnTete(): KfNgClasse {
        if (this.pGéreCssEnTête) {
            return this.pGéreCssEnTête.classe;
        }
    }

    ajouteClasseCroix(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssCroix) {
            this.pGéreCssCroix = new KfGéreCss();
        }
        this.pGéreCssCroix.ajouteClasseDefArray(classeDefs);
    }

    get classeCroix(): KfNgClasse {
        if (this.pGéreCssCroix) {
            return this.pGéreCssCroix.classe;
        }
    }

    ajouteClasseCorps(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssCorps) {
            this.pGéreCssCorps = new KfGéreCss();
        }
        this.pGéreCssCorps.ajouteClasseDefArray(classeDefs);
    }

    get classeCorps(): KfNgClasse {
        if (this.pGéreCssCorps) {
            return this.pGéreCssCorps.classe;
        }
    }

    ajouteClassePied(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssPied) {
            this.pGéreCssPied = new KfGéreCss();
        }
        this.pGéreCssPied.ajouteClasseDefArray(classeDefs);
    }

    get classePied(): KfNgClasse {
        if (this.pGéreCssPied) {
            return this.pGéreCssPied.classe;
        }
    }

    set avecFond(avecFond: boolean | 'static') {
        this.pOptions.backdrop = avecFond;
    }

    set backdropClass(classe: string) {
        this.pOptions.backdropClass = classe;
    }

    set centré(centré: boolean) {
        this.pOptions.centered = centré;
    }

    set windowClass(classe: string) {
        this.pOptions.windowClass = classe;
    }

    set ferméSiEchap(ferméSiEchap: boolean) {
        this.pOptions.keyboard = ferméSiEchap;
    }

    set peutDéfiler(peutDéfiler: boolean) {
        this.pOptions.scrollable = peutDéfiler;
    }

    set taille(taille: 'sm' | 'lg' | 'xl' | string) {
        this.pOptions.size = taille;
    }

}
