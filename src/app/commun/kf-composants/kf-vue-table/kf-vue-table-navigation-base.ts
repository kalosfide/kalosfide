import { KfClavierTouche } from '../kf-partages/kf-clavier/kf-clavier-touche';
import { IKfVueTableNavigationAuClavierDef } from "./i-kf-vue-table-navigation-au-clavier-def";
import { KfVueTable } from "./kf-vue-table";
import { KfVueTableLigne } from "./kf-vue-table-ligne";

export abstract class KfVueTableNavigationBase<T> {
    protected def: IKfVueTableNavigationAuClavierDef;

    protected pAleFocus: boolean;

    protected pVueTable: KfVueTable<T>;

    protected fixeClasseLigneActive: (ligne: KfVueTableLigne<T>) => void;

    traiteToucheEnfoncée: (event: KeyboardEvent) => boolean;

    constructor(vueTable: KfVueTable<T>, def: IKfVueTableNavigationAuClavierDef) {
        this.pVueTable = vueTable;
        this.def = def;
        const traitements: ((event: KeyboardEvent) => boolean)[] = [];
        if (def.controlePagination && vueTable.pagination) {
            traitements.push(this.traitePagination.bind(this));
        }
        traitements.push(this.traite.bind(this));
        this.traiteToucheEnfoncée = (event: KeyboardEvent) => {
            if (!this.estCtrlAltShift(event)) {
                let traité = false;
                for (let index = 0; index < traitements.length && !traité; index++) {
                    traité = traitements[index](event);
                }
                return traité;
            }
        }
        if (def.classeLigneActive) {
            this.fixeClasseLigneActive = (ligne: KfVueTableLigne<T>) => {
                if (this.ligneActive) {
                    this.ligneActive.géreCss.supprimeClasse(def.classeLigneActive);
                }
                ligne.géreCss.ajouteClasse(def.classeLigneActive);        
            }
        }
    }

    get type(): 'lignes' | 'cellules' {
        return this.def.type;
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
    abstract get ligneActive(): KfVueTableLigne<T>;

    abstract fixeLigneActive(ligne: KfVueTableLigne<T>): void;

    /** 
     * S'il n'a pas de ligne active, active la première ligne qui passe les filtres s'il y en a une.
     * Si la ligne active ne passe pas les filtres, active la ligne suivante qui passe les filtres s'il y en a une
     * ou la ligne précédente qui passe les filtres s'il y en a une
    */
    quandFiltresAppliqués(): void {
        if (!this.ligneActive) {
            const lignes = this.pVueTable.corps.lignes.filter(l => l.indexFiltré !== -1);
            if (lignes.length > 0) {
                this.fixeLigneActive(lignes[0])
            }
            return;
        }
        // on doit changer la ligne active si elle ne passe pas les filtres
        if (this.ligneActive.indexFiltré === -1) {
            // la ligne active et les lignes qui passent les filtres dans l'ordre
            const lignes = this.pVueTable.corps.lignes.filter(l => l.indexFiltré !== -1 || l === this.ligneActive);
            const index = lignes.findIndex(l => l === this.ligneActive);
            if (index < lignes.length - 1) {
                // il y a une ligne aprés la ligne active qui passe les filtres
                this.fixeLigneActive(lignes[index + 1]);
            } else {
                if (index > 0) {
                    // il y a une ligne avant la ligne active qui passe les filtres
                    this.fixeLigneActive(lignes[index - 1]);
                }
            }
        }
    }

    get aLeFocus(): boolean {
        return this.pAleFocus;
    }

    abstract fixeLeFocus(): void;

    protected estCtrlAltShift(event: KeyboardEvent): boolean {
        return event.key === 'Control' || event.key === 'Alt' || event.key === 'Shift';
    }

    traitePagination(event: KeyboardEvent): boolean {
        switch (event.key as KfClavierTouche) {
            case 'Home':
                if (event.ctrlKey && !event.altKey && !event.shiftKey) {
                    this.pVueTable.pagination.vaAPremièrePage();
                    return true;
                }
                break;
            case 'End':
                if (event.ctrlKey && !event.altKey && !event.shiftKey) {
                    this.pVueTable.pagination.vaADernièrePage();
                    return true;
                }
                break;
            case 'PageUp':
                if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                    this.pVueTable.pagination.vaAPagePrécédente();
                    return true;
                }
                break;
            case'PageDown':
                if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                    this.pVueTable.pagination.vaAPageSuivante();
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    }

    focusLigneAuDessus() {
        const lignesVisibles = this.pVueTable.corps.lignesVisibles;
        const indexDansVisibles = lignesVisibles.findIndex(l => l === this.ligneActive);
        if (indexDansVisibles > 0) {
            this.fixeLigneActive(lignesVisibles[indexDansVisibles - 1]);
            this.fixeLeFocus();
        } else {
            // c'est la première ligne visible
            const pagination = this.pVueTable.pagination;
            if (pagination) {
                if (pagination.pageActive > 1) {
                    pagination.vaAPage(pagination.pageActive - 1);
                    this.fixeLigneActive(lignesVisibles[lignesVisibles.length - 1]);
                }
            }
        }
    }

    focusLigneAuDessous() {
        const lignesVisibles = this.pVueTable.corps.lignesVisibles;
        const indexDansVisibles = lignesVisibles.findIndex(l => l === this.ligneActive);
        if (indexDansVisibles < lignesVisibles.length - 1) {
            this.fixeLigneActive(lignesVisibles[indexDansVisibles + 1]);
            this.fixeLeFocus();
        } else {
            // c'est la dernière ligne visible
            const pagination = this.pVueTable.pagination;
            if (pagination) {
                if (pagination.pageActive < pagination.nbPages) {
                    pagination.vaAPage(pagination.pageActive + 1);
                    this.fixeLigneActive(lignesVisibles[0]);
                    this.fixeLeFocus();
                }
            }
        }
    }

    abstract traite(event: KeyboardEvent): boolean;
}
