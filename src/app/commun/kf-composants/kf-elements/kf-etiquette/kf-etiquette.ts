import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfContenuPhrase, KfContenuPhraséDefs, KfTypeContenuPhrasé } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfstringDefs } from '../kf-texte/kf-textes';
import { KfTexte } from '../kf-texte/kf-texte';

export class KfEtiquette extends KfComposant {

    private plabelFor: KfComposant;

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, KfTypeDeComposant.etiquette);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
    }

    labelise(composant: KfComposant) {
        if (composant.nom === '') {
            throw new Error('Un composant avec label doit avoir un nom');
        }
        this.plabelFor = composant;
        this.suitLaVisiblité(composant);
    }

    get labelFor(): string {
        if (this.plabelFor) {
            return this.plabelFor.nom;
        }
    }

    private pBaliseHtml: KfTypeDeBaliseHTML;

    get baliseHtml(): KfTypeDeBaliseHTML {
        if (this.pBaliseHtml) {
            return this.pBaliseHtml;
        }
        if (this.avecClassesOuStyle) {
            return KfTypeDeBaliseHTML.span;
        }
    }
    set baliseHtml(baliseHtml: KfTypeDeBaliseHTML) {
        this.pBaliseHtml = baliseHtml;
    }

    /**
     * Ajoute aux contenus phrasés des KfTexte avec balise Html, retourne l'array des KfTexte créés
     * @param defs (string | () => string) ou (string | () => string)[]
     */
     ajouteTextes(...defs: KfstringDefs[]): KfTexte[] {
        const kfTextes: KfTexte[] = this.contenuPhrase.ajouteTextes(...defs);
        return kfTextes;
    }

    /**
     * Remplace les contenus phrasés par des KfTexte avec balise Html, retourne l'array des KfTexte créés
     * @param defs (string | () => string) ou (string | () => string)[]
     */
    fixeTextes(...defs: KfstringDefs[]): KfTexte[] {
        const kfTextes: KfTexte[] = this.contenuPhrase.fixeTextes(...defs);
        return kfTextes;
    }

    /**
     * Ajoute des contenus phrasés. Retourne l'array des contenus ajoutés
     * @param defs si defs est de type string | () => string | (string | () => string)[], un KfTexte est créé et ajouté;
     * si defs est de type KfTexte | KfImage | KfIcone | KfLien, defs est ajouté
     */
    ajouteContenus(...defs: KfContenuPhraséDefs[]): KfTypeContenuPhrasé[] {
        const contenus = this.contenuPhrase.ajouteContenus(...defs);
        return contenus;
    }

    /**
     * Fixe les contenus phrasés. Retourne l'array des contenus ajoutés
     * @param defs si defs est de type string | () => string | (string | () => string)[], un KfTexte est créé et ajouté;
     * si defs est de type KfTexte | KfImage | KfIcone | KfLien, defs est ajouté
     */
    fixeContenus(...defs: KfContenuPhraséDefs[]): KfTypeContenuPhrasé[] {
        const contenus = this.contenuPhrase.fixeContenus(...defs);
        return contenus;
    }

    supprimeContenus() {
        this.contenuPhrase.contenus = [];
    }

}
