import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfVueTable } from './kf-vue-table';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfVueTableSectionBase } from './kf-vue-table-section-base';

export class KfVueTableCorps<T> extends KfVueTableSectionBase<T> {
    pLignesVisibles: KfVueTableLigne<T>[];

    constructor(vueTable: KfVueTable<T>) {
        super(vueTable);
    }

    /** 
     * Lignes triées s'il y a un tri
     */
    get lignes(): KfVueTableLigne<T>[] {
        return this.pLignes.map(l => l as KfVueTableLigne<T>)
    }

    /**
     * définit des classes css à appliquer suivant l'état et l'effet des filtres
     * @param siFiltrée classe css du corps de la table quand des lignes sont arrêtées par les filtres
     * @param siNonFiltrée classe css du corps de la table quand aucune ligne n'est arrêtée par les filtres
     */
    fixeClassesFiltre(siFiltrée?: string, siNonFiltrée?: string) {
        if (!this.pGereCss) {
            this.pGereCss = new KfGéreCss();
        }
        if (siFiltrée) {
            this.pGereCss.ajouteClasse({
                nom: siFiltrée,
                active: () => this.pVueTable.estFiltrée
            });
        }
        if (siNonFiltrée) {
            this.pGereCss.ajouteClasse({
                nom: siNonFiltrée,
                active: () => !this.pVueTable.estFiltrée
            });
        }
    }

    private trie(lignes: KfVueTableLigne<T>[]): KfVueTableLigne<T>[] {
        const colonneDeTri = this.pVueTable.colonneDeTri;
        return colonneDeTri
            ? colonneDeTri.tri.trie(lignes)
            : lignes;
    }

    /**
     * Initialise la liste des lignes en triant les lignes de la vueTable
     */
    fixeLignes() {
        this.pLignes = this.trie(this.pVueTable.lignes);
    }

    /**
     * Initialise la liste des lignes en triant les lignes de la vueTable.
     * Fixe l'indexTriéFiltré des lignes qui passent les filtres.
     */
    appliqueTri() {
        this.pLignes = this.trie(this.pVueTable.lignes);
        const lignesFiltréesTriées = this.lignes.filter(l => l.indexFiltré !== -1);
        let indexTriéFiltré = 0;
        lignesFiltréesTriées.forEach(l => {
            l.indexFiltré = indexTriéFiltré++;
        });
    }

    /**
     * Affecte aux lignes un indexFiltré égal à -1 si la ligne a été exclue par le filtre
     * ou à l'index de la ligne dans la liste des lignes filtrées.
     */
    appliqueFiltres() {
        let indexTriéFiltré = 0;
        let valideLigne: (ligne: KfVueTableLigne<T>) => boolean;
        if (this.pVueTable.outils) {
            valideLigne = this.pVueTable.outils.valideLigne;
        }
        if (valideLigne) {
            this.lignes.forEach(l => {
                l.indexFiltré = valideLigne(l) ? indexTriéFiltré++ : -1;
            });
        } else {
            this.lignes.forEach(l => {
                l.indexFiltré = indexTriéFiltré++;
            });
        }
    }

    supprimeLigne(ligne: KfVueTableLigne<T>) {
        this.pLignes = this.lignes.filter(l => l.index !== ligne.index);
        let àActiver: KfVueTableLigne<T>;
        // si la ligne supprimée faisait partie des lignes visibles
        // (ce qui est le cas si le déclencheur de la suppression était dans une cellule de la ligne)
        // il faut mettre à jour les indexFiltré des lignes suivantes
        if (ligne.indexFiltré !== -1) {
            const triéesFiltréesAprés = this.lignes.filter(l => l.indexFiltré > ligne.indexFiltré)
            if (triéesFiltréesAprés.length > 0) {
                triéesFiltréesAprés.forEach(l => l.indexFiltré--);
                àActiver = triéesFiltréesAprés[0];
            } else {
                if (ligne.indexFiltré > 0) {
                    àActiver = this.lignes.find(l => l.indexFiltré === ligne.indexFiltré - 1);
                }
            }
        }
    }

    fixeLignesVisibles() {
        let visible: (ligne: KfVueTableLigne<T>) => boolean
        if (this.vueTable.pagination) {
            const indexDansPage = this.vueTable.pagination.indexLignesDansPage;
            visible = (ligne: KfVueTableLigne<T>) => ligne.indexFiltré >= indexDansPage.première && ligne.indexFiltré <= indexDansPage.dernière;
        } else {
            visible = (ligne: KfVueTableLigne<T>) => ligne.indexFiltré >= 0;
        }
        this.pLignesVisibles = this.lignes.filter(l => visible(l));
    }

    get lignesVisibles(): KfVueTableLigne<T>[] {
        return this.pLignesVisibles;
    }

}
