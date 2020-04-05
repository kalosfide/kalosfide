import { KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfGéreCss } from '../kf-gere-css';

export class KfBalise extends KfGéreCss {
    baliseHTML: KfTypeDeBaliseHTML;

    private _contenuPhrase: KfContenuPhrase;

    set contenuPhrase(contenuPhrase: KfContenuPhrase) {
        this._contenuPhrase = contenuPhrase;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this._contenuPhrase;
    }

    private _contenuBalise: KfBalise;

    set contenuBalise(contenuBalise: KfBalise) {
        this._contenuBalise = contenuBalise;
    }

    get contenuBalise(): KfBalise {
        return this._contenuBalise;
    }

    private _contenuTexte: string;

    set contenuTexte(contenuTexte: string) {
        this._contenuTexte = contenuTexte;
    }

    get contenuTexte(): string {
        return this._contenuTexte;
    }

    afterViewInit: (htmlElement: HTMLElement) => void;

}
