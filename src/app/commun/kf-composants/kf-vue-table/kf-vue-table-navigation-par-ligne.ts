import { KfClavierTouche } from '../kf-partages/kf-clavier/kf-clavier-touche';
import { IKfVueTableNavigationAuClavierDef } from "./i-kf-vue-table-navigation-au-clavier-def";
import { KfVueTable } from "./kf-vue-table";
import { KfVueTableLigne } from "./kf-vue-table-ligne";
import { KfVueTableNavigationBase } from "./kf-vue-table-navigation-base";

export class KfVueTableNavigationParLigne<T> extends KfVueTableNavigationBase<T> {

    private pLigneActive: KfVueTableLigne<T>;

    constructor(vueTable: KfVueTable<T>, def: IKfVueTableNavigationAuClavierDef) {
        super(vueTable, def);
    }

    /**
     * N'existe pas si le corps n'a pas de lignes qui passent les filtres.
     * Première ligne du corps aprés le tri initial.
     * Si supprimée ou filtre appliqué et ne passe pas les filtres, remplacée par la suivante
     * ou la précédente si la suivante n'existe pas. Force le changement de page pour être dans la page active.
     * Si changée par les touches de direction, force le changement de page pour être dans la page active.
     * Si page changée, remplacée par la première ligne de la nouvelle page.
     * Si nombre de lignes par page changé, force le changement de page pour être dans la page active
     */
    get ligneActive(): KfVueTableLigne<T> {
        return this.pLigneActive;
    }
    fixeLigneActive(ligne: KfVueTableLigne<T>) {
        if (this.fixeClasseLigneActive) {
            this.fixeClasseLigneActive(ligne);
        }
        this.pLigneActive = ligne;
    }

    fixeLeFocus() {
        if (!this.ligneActive) {
            if (this.pVueTable.corps.lignesVisibles) {
                this.fixeLigneActive(this.pVueTable.corps.lignesVisibles[0]);
            }
        }
        if (this.ligneActive) {
            const focusPris = this.ligneActive.géreHtml.prendLeFocus();
            console.log(`corps.prendLeFocus ${this.ligneActive.index} ${focusPris}`);
        }
    }

    quandLignePrendFocus(ligne: KfVueTableLigne<T>) {
        this.fixeLigneActive(ligne);
        console.log(`nav focus ligne ${ligne.index}`);
        this.pVueTable.composant.traiteKeydownService.traiteurDuFocus = this.traiteToucheEnfoncée.bind(this);
        this.pAleFocus = true;
    }

    quandLignePerdFocus() {
        console.log(`nav blur ligne ${this.ligneActive.index}`)
        //        this.pVueTable.composant.traiteKeydownService.traiteurDuFocus = undefined;
        this.pAleFocus = false;
    }

    traite(event: KeyboardEvent): boolean {
        switch (event.key as KfClavierTouche) {
            case 'ArrowUp':
            case 'Up': // pour les vieux navigateurs
                if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                    this.focusLigneAuDessus();
                    return true;
                }
                break;
            case 'ArrowDown':
            case 'Down': // pour les vieux navigateurs
                if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                    this.focusLigneAuDessous();
                    return true;
                }
                break;

            case 'Enter':
            case ' ':
                if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                    const équivalentPourClic = this.ligneActive.équivalentPourClic;
                    if (équivalentPourClic) {
                        équivalentPourClic.gereHtml.htmlElement.click();
                        return true;
                    }
                }
                break;
            default:
                break;
        }
        return false;
    }
}
