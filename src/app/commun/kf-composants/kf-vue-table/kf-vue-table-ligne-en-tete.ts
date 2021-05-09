import { KfVueTable } from './kf-vue-table';
import { KfVueTableCelluleEnTete } from './kf-vue-table-cellule-en-tete';
import { KfVueTableLigneBase, IKfVueTableLigne } from './kf-vue-table-ligne-base';
import { KfVueTableEnTete } from './kf-vue-table-section-en-tete';

export class KfVueTableLigneEnTete<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {
    private pNom: string;

    /**
     * @param enTête KfVueTableSectionBase contenant la ligne
     */
    constructor(enTête: KfVueTableEnTete<T>, estSousChapeau?: boolean) {
        super(enTête);
        this.pNom = estSousChapeau ? 'B1' : 'B';
        this.pCellules = [];
    }

    get nom(): string {
        return this.pNom;
    }

    ajoute(cellule: KfVueTableCelluleEnTete<T>) {
        this.pCellules.push(cellule);
    }

}
