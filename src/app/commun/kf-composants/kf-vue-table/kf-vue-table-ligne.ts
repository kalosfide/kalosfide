import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { FormGroup } from '@angular/forms';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfVueTableCellule } from './kf-vue-table-cellule';
import { KfVueTableLigneBase, IKfVueTableLigne } from './kf-vue-table-ligne-base';
import { KfVueTableCorps } from './kf-vue-table-section-corps';
import { KfEvenement, KfTypeDEvenement, KfTypeDHTMLEvents } from '../kf-partages/kf-evenements';
import { EventEmitter } from '@angular/core';
import { KfVueTableNavigationParLigne } from './kf-vue-table-navigation-par-ligne';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';

export class KfVueTableLigne<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {
    /**
     * Index de la ligne. Fixé à la création.
     */
    index: number;
    /**
     * Numéro de la ligne. Fixé s'il y a une colonne des numéros à la création ou après le tri initial s'il y en a un.
     */
    no: number;
    /**
     * Objet à afficher dans la ligne
     */
    private pItem: T;
    /**
     * Présent quand la l'item a une valeur
     */
    private pSuperGroupe: KfSuperGroupe;
    /**
     * Index de la ligne parmi les lignes triées filtrées
     */
    indexFiltré: number;

    /**
     * Crée une ligne pour l'item à ajouter aux lignes de la vueTable
     * @param corps corps de la table contenant la ligne
     * @param item item de la ligne
     * @param index index de la ligne dans l'ordre de création (pour nommer les cellules)
     */
    constructor(corps: KfVueTableCorps<T>, item: T, index: number) {
        super(corps);
        this.index = index;
        const vueTable = corps.vueTable;
        if (vueTable.superGroupe) {
            this.pSuperGroupe = vueTable.superGroupe(item);
            this.pSuperGroupe.listeParent = vueTable;
        }
        this.item = item;
        if (vueTable.quandClic) {
            if (!this.pGéreCss) {
                this.pGéreCss = new KfGéreCss();
            }
            this.pGéreCss.ajouteClasse('kf-bouton');
            this.pGéreHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
            this.pGéreHtml.ajouteTraiteur(KfTypeDEvenement.click, () => vueTable.quandClic(item)());
        }
        if (vueTable.navigationAuClavier && vueTable.navigationAuClavier.type === 'lignes') {
            const navigation = vueTable.navigationAuClavier as KfVueTableNavigationParLigne<T>;
            const quandFocusPris = () => navigation.quandLignePrendFocus(this);
            const quandFocusPerdu = () => navigation.quandLignePerdFocus();
            this.pGéreHtml.fixeAttribut('tabindex', '0');
            this.pGéreHtml.suitLeFocus(quandFocusPris, quandFocusPerdu);
        }
    }

    get corps(): KfVueTableCorps<T> {
        return this.pSection as KfVueTableCorps<T>;
    }

    public get nom(): string {
        return '' + this.index;
    }

    public get item(): T {
        return this.pItem;
    }

    public set item(valeur: T) {
        this.pItem = valeur;
        this.pCellules = this.vueTable.colonnes.map(colonne => new KfVueTableCellule<T>(colonne, this, valeur));
        if (this.vueTable.avecEnTêtesDeLigne) {
            this.pCellules[0].thScope = 'row';
        }
        if (this.vueTable.gereCssLigne) {
            this.pGéreCss = this.vueTable.gereCssLigne(valeur);
        }
    }

    get id(): string {
        if (this.pSection.vueTable.id) {
            return this.pSection.vueTable.id(this.pItem);
        }
    }

    public get superGroupe(): KfSuperGroupe {
        return this.pSuperGroupe;
    }

    public get erreurs(): string[] {
        if (this.pSuperGroupe.avecInvalidFeedback) {
            const erreurs: string[] = [];
            this.pSuperGroupe.contenus.forEach(c => {
                const errs = c.erreurs;
                if (errs) {
                    erreurs.push(...errs);
                }
            });
            if (erreurs.length > 0) {
                return erreurs;
            }
        }
    }

    public get formGroup(): FormGroup {
        return this.pSuperGroupe.formGroup;
    }

    /**
     * Met à jour le contenu des cellules qui dépendent de la valeur de l'item.
     * Indique à la vueTable que la ligne a été modifiée.
     */
    public quandItemModifié() {
        this.pCellules.forEach(c => (c as KfVueTableCellule<T>).quandItemModifié());
        this.vueTable.quandLigneModifiée(this);
    }

    /**
     * Fixe le contenu de la première cellule avec le numéro de la ligne dans la liste des lignes triées par le tri initial s'il y en a un
     * @param index index de la ligne parmi les lignes aprés le chargement et le tri initial éventuel
     */
    public fixeNuméro(index: number) {
        this.no = index + 1;
        this.pCellules[0].fixeTexte('' + this.no);
    }

    public prendLeFocus(): boolean {
        return this.pGéreHtml.prendLeFocus()
    }
}
