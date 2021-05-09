import { KfVueTable } from './kf-vue-table';
import { KfVueTableLigneBilan } from './kf-vue-table-ligne-bilan';
import { KfVueTableSectionBase } from './kf-vue-table-section-base';

export class KfVueTableBilan<T> extends KfVueTableSectionBase<T> {

    constructor(vueTable: KfVueTable<T>) {
        super(vueTable);
        const colonnesAvecBilan = vueTable.colonnes.filter(c => c.bilanDef !== undefined && c.bilanDef !== null);
        this.pLignes = []
        if (colonnesAvecBilan.length > 0) {
            this.pLignes.push(new KfVueTableLigneBilan(this));
            const colonnesAvecBilanDesVisibles = colonnesAvecBilan.filter(
                c => c.bilanDef.titreBilanDesVisibles !== undefined && c.bilanDef.titreBilanDesVisibles !== null
            );
            if (colonnesAvecBilanDesVisibles.length > 0) {
                this.pLignes.push(new KfVueTableLigneBilan(this, true));
            }
        }
    }

    get lignes(): KfVueTableLigneBilan<T>[] {
        return this.pLignes.map(l => l as KfVueTableLigneBilan<T>)
    }

    get lignesVisibles(): KfVueTableLigneBilan<T>[] {
        return this.pLignes.map(l => l as KfVueTableLigneBilan<T>)
    }

    /**
     * Mise à jour des textes des contenus des cellules avec bilan.
     */
    quandBilanChange() {
        this.pLignes.forEach(l => (l as KfVueTableLigneBilan<T>).quandBilanChange());
    }

    quandFiltreChange() {
        if (this.pLignes.length > 1) {
            // il y a une ligne bilan des lignesVisibles
            (this.pLignes[1] as KfVueTableLigneBilan<T>).quandBilanChange();
        }
    }

}
