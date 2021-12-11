import { KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfGéreCss } from '../kf-gere-css';

export class KfBalise extends KfGéreCss {
    baliseHTML: KfTypeDeBaliseHTML;
    id: string;

    private pContenuPhrase: KfContenuPhrase;

    set contenuPhrase(contenuPhrase: KfContenuPhrase) {
        this.pContenuPhrase = contenuPhrase;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.pContenuPhrase;
    }

    private pContenuBalise: KfBalise;

    set contenuBalise(contenuBalise: KfBalise) {
        this.pContenuBalise = contenuBalise;
    }

    get contenuBalise(): KfBalise {
        return this.pContenuBalise;
    }

    private pContenuTexte: string;

    set contenuTexte(contenuTexte: string) {
        this.pContenuTexte = contenuTexte;
    }

    get contenuTexte(): string {
        return this.pContenuTexte;
    }

    afterViewInit: (htmlElement: HTMLElement) => void;

}
