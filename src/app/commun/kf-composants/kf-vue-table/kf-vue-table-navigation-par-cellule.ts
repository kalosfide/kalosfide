import { KfEntrée } from "../kf-elements/kf-entree/kf-entree";
import { KfClavierTouche } from '../kf-partages/kf-clavier/kf-clavier-touche';
import { KfClavierToucheEnfoncée } from "../kf-partages/kf-clavier/kf-clavier-touche-enfoncee";
import { IKfVueTableNavigationAuClavierDef } from "./i-kf-vue-table-navigation-au-clavier-def";
import { KfVueTable } from "./kf-vue-table";
import { KfVueTableCellule } from "./kf-vue-table-cellule";
import { IKfVueTableCellule } from "./kf-vue-table-cellule-base";
import { KfVueTableLigne } from "./kf-vue-table-ligne";
import { KfVueTableNavigationBase } from "./kf-vue-table-navigation-base";

export class KfVueTableNavigationParCellule<T> extends KfVueTableNavigationBase<T> {

    private pCelluleActive: KfVueTableCellule<T>;

    private pValeurQuandPrendFocus: any;

    constructor(vueTable: KfVueTable<T>, def: IKfVueTableNavigationAuClavierDef) {
        super(vueTable, def);
    }

    /**
     * Si vrai, seules les cellules dont le contenu est une entrée ou un lien ou un bouton participent à la navigation.
     */
    get entréesEtActionsSeulement(): boolean {
        return this.def.entréesEtActionsSeulement
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
        return this.pCelluleActive ? this.pCelluleActive.ligne : undefined;
    }
    fixeLigneActive(ligne: KfVueTableLigne<T>) {
        if (this.fixeClasseLigneActive) {
            this.fixeClasseLigneActive(ligne);
        }
        if (!this.pCelluleActive) {
            this.pCelluleActive = this.cellulesActivables(ligne)[0] as KfVueTableCellule<T>;
        } else {
            const indexColonne = this.pCelluleActive.colonne.index;
            this.pCelluleActive = ligne.cellules.find(c => c.colonne.index === indexColonne) as KfVueTableCellule<T>;
        }
    }

    cellulesActivables(ligne: KfVueTableLigne<T>): IKfVueTableCellule[] {
        return ligne.cellulesVisibles.filter(c => (c as KfVueTableCellule<T>).estFocusable);
    }

    fixeLeFocus() {
        if (!this.ligneActive) {
            if (this.pVueTable.corps.lignesVisibles) {
                this.fixeLigneActive(this.pVueTable.corps.lignesVisibles[0]);
            }
        }
        if (this.pCelluleActive) {
            const focusPris = this.pCelluleActive.prendLeFocus();
            console.log(`corps.prendLeFocus ${this.pCelluleActive.ligne.index} ${this.pCelluleActive.colonne.index} ${focusPris}`);
        }
    }

    quandCellulePrendFocus(cellule: KfVueTableCellule<T>) {
        this.pCelluleActive = cellule;
        this.pValeurQuandPrendFocus = this.pCelluleActive.aContenuEditable ? this.pCelluleActive.contenu.gereValeur.valeur : undefined;
        if (this.fixeClasseLigneActive) {
            this.fixeClasseLigneActive(cellule.ligne);
        }
        this.pVueTable.composant.traiteKeydownService.traiteurDuFocus = this.traiteToucheEnfoncée.bind(this);
        console.log(`nav cellule ${cellule.ligne.index} ${cellule.colonne.index}`);
        this.pAleFocus = true;
    }

    quandCellulePerdFocus() {
        if (this.pCelluleActive.aContenuEditable) {
            const entrée = this.pCelluleActive.contenu as KfEntrée;
            if (!entrée.lectureSeule) {
                // on quitte la cellule en cours d'édition sans sauvegarder
                // il faut rétablir la valeur avant édition si changé
                
            }
            this.pValeurQuandPrendFocus = undefined;
        }
        console.log(`nav cellule ${this.pCelluleActive.ligne.index} ${this.pCelluleActive.colonne.index}`);
        this.pAleFocus = false;
    }

    private traiteCliquable(event: KeyboardEvent): boolean {
        const key = event.key as KfClavierTouche;
        if (key === 'Enter' || key === ' ' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
            this.pCelluleActive.contenu.gereHtml.htmlElement.click();
        }
        return false;
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
            case 'ArrowLeft':
            case 'Left': // pour les vieux navigateurs
                if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                    const activables = this.cellulesActivables(this.pCelluleActive.ligne);
                    const index = activables.findIndex(c => c === this.pCelluleActive);
                    if (index > 0) {
                        const cellule = activables[index - 1] as KfVueTableCellule<T>;
                        cellule.prendLeFocus();
                    } else {
                        this.pCelluleActive = activables[activables.length - 1] as KfVueTableCellule<T>;
                        this.focusLigneAuDessus();
                    }
                    return true;
                }
                break;
            case 'ArrowRight':
            case 'Right': // pour les vieux navigateurs
                if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                    const activables = this.cellulesActivables(this.pCelluleActive.ligne);
                    const index = activables.findIndex(c => c === this.pCelluleActive);
                    if (index < activables.length - 1) {
                        const cellule = activables[index + 1] as KfVueTableCellule<T>;
                        cellule.prendLeFocus();
                    } else {
                        this.pCelluleActive = activables[0] as KfVueTableCellule<T>;
                        this.focusLigneAuDessous();
                    }
                    return true;
                }
                break;
            default:
                if (this.pCelluleActive.aContenuClicable) {
                    return this.traiteCliquable(event);
                }
                break;
        }
        return false;
    }
}
