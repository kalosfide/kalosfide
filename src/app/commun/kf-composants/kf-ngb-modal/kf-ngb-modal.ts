import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfStringDef } from '../kf-partages/kf-string-def';
import { KfNgClasseDef, KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfComposant } from '../kf-composant/kf-composant';

export interface IKfNgbModalDef {
    titre: string;
    corps?: KfGroupe;
    boutonOk?: KfBouton;
    /**
     * les boutons doivent avoir des noms différents entre eux et différent de ngbModalCroix
     */
    boutonsDontOk?: KfBouton[];
    options?: NgbModalOptions;
    /**
     * Si absent, le comportement par défaut des NgbModal met le focus sur la croix de fermeture.
     * Si présent et égal à 'sans', aucun élément n'aura le focus à l'ouverture.
     * Si présent et égal à un Kfcomposant, ce composant aura le focus à l'ouverture
     */
    autoFocus?: 'sans' | KfComposant
}

export class KfNgbModal {
    private pDef: IKfNgbModalDef;
    private pGéreCssEnTête: KfGéreCss;
    private pGéreCssTitre: KfGéreCss;
    private pGéreCssCorps: KfGéreCss;
    private pGéreCssPied: KfGéreCss;

    private pOptions: NgbModalOptions;

    constructor(def: IKfNgbModalDef) {
        this.pDef = def;
        if (def.autoFocus && def.autoFocus !== 'sans') {
            def.autoFocus.gereHtml.fixeAttribut('ngbAutofocus');
        }
        this.pOptions = {};
    }

    get titre(): string { return this.pDef.titre; }
    get corps(): KfGroupe { return this.pDef.corps; }
    get boutonOk(): KfBouton { return this.pDef.boutonOk; }
    get boutons(): KfBouton[] {
        return this.pDef.boutonsDontOk ? this.pDef.boutonsDontOk : this.pDef.boutonOk ? [this.pDef.boutonOk] : undefined;
    }
    get sansAutoFocus(): boolean {
        return this.pDef.autoFocus === 'sans';
    }
    get options(): NgbModalOptions { return this.pOptions; }

    ajouteClasseEnTête(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssEnTête) {
            this.pGéreCssEnTête = new KfGéreCss();
        }
        this.pGéreCssEnTête.ajouteClasse(...classeDefs);
    }

    get classeEnTete(): KfNgClasse {
        if (this.pGéreCssEnTête) {
            return this.pGéreCssEnTête.classe;
        }
    }

    ajouteClasseTitre(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssTitre) {
            this.pGéreCssTitre = new KfGéreCss();
        }
        this.pGéreCssTitre.ajouteClasse(...classeDefs);
    }

    get classeTitre(): KfNgClasse {
        if (this.pGéreCssTitre) {
            return this.pGéreCssTitre.classe;
        }
    }

    ajouteClasseCorps(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssCorps) {
            this.pGéreCssCorps = new KfGéreCss();
        }
        this.pGéreCssCorps.ajouteClasse(...classeDefs);
    }

    get classeCorps(): KfNgClasse {
        if (this.pGéreCssCorps) {
            return this.pGéreCssCorps.classe;
        }
    }

    ajouteClassePied(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssPied) {
            this.pGéreCssPied = new KfGéreCss();
        }
        this.pGéreCssPied.ajouteClasse(...classeDefs);
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
