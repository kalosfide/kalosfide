import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';

export interface IKfNgbModalDef {
    titre?: string;
    corps?: KfGroupe;
    boutonOk?: KfBouton;
    /**
     * les boutons doivent avoir des noms différents entre eux et différent de ngbModalCroix
     */
    boutonsDontOk?: KfBouton[];
    options?: NgbModalOptions;
    /**
     * Si absent, le comportement par défaut des NgbModal met le focus sur la croix de fermeture.
     * Si présent et égal à 'sans', aucun élément visible n'aura le focus à l'ouverture.
     * Si présent et égal à un Kfcomposant, ce composant aura le focus à l'ouverture
     */
    autoFocus?: 'sans' | KfComposant
    /**
     * Si présent et vrai, la fenêtre est déplaçable avec la souris.
     */
    déplaçable?: boolean;
    /**
     * Si présent et vrai et si déplaçable par le titre, le titre aura le style cursor: move.
     */
    curseurDéplacement?: boolean;
}

export class KfNgbModal {
    private pEnTête: KfGroupe;
    private pTitre: KfEtiquette;
    private pCorps: KfGroupe;
    private pPied: KfGroupe;
    private pBoutons: KfBouton[];
    private pBoutonOk: KfBouton;
    private pAutofocus: boolean;

    private pDéplaçable: boolean;
    private pCurseurDéplacement: boolean

    private pOptions: NgbModalOptions;

    constructor(def: IKfNgbModalDef) {
        this.pBoutons = def.boutonsDontOk ? def.boutonsDontOk : def.boutonOk ? [def.boutonOk] : undefined;
        if (!def.titre && !def.corps && !this.pBoutons) {
            throw new Error('Un KfNgbModalDef doit avoir au moins un titre ou un corps ou un bouton.');
        }
        if (def.titre) {
            this.pEnTête = new KfGroupe('');
            this.pTitre = new KfEtiquette('', def.titre);
        }
        this.pCorps = def.corps;
        if (this.pBoutons) {
            this.pPied = new KfGroupe('');
        }
        this.pAutofocus = def.autoFocus !== 'sans';
        if (def.autoFocus && def.autoFocus !== 'sans') {
            def.autoFocus.gereHtml.fixeAttribut('ngbAutofocus');
        }
        this.pBoutonOk = def.boutonOk
        this.pOptions = {};
        this.pDéplaçable = def.déplaçable;
        this.pCurseurDéplacement = def.curseurDéplacement;
    }

    get enTete(): KfGroupe { return this.pEnTête; }
    get titre(): KfEtiquette { return this.pTitre; }
    get corps(): KfGroupe { return this.pCorps; }
    get pied(): KfGroupe { return this.pPied; }
    get boutonOk(): KfBouton { return this.pBoutonOk; }
    get boutons(): KfBouton[] { return this.pBoutons; }

    get sansAutoFocus(): boolean {
        return !this.pAutofocus;
    }

    get déplaçable(): boolean {
        return this.pDéplaçable;
    }
    get curseurDéplacement(): boolean {
        return this.pCurseurDéplacement;
    }

    get options(): NgbModalOptions { return this.pOptions; }

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
