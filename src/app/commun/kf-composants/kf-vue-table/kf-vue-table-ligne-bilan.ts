import { KfVueTableCelluleBilan } from './kf-vue-table-cellule-bilan';
import { IKfVueTableLigne, KfVueTableLigneBase } from './kf-vue-table-ligne-base';
import { KfVueTableBilan } from './kf-vue-table-section-bilan';

export class KfVueTableLigneBilan<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {
    private pNom: string;

    /**
     * @param bilan KfVueTableSectionBase contenant la ligne
     */
    constructor(bilan: KfVueTableBilan<T>, estBilanDesVisibles?: boolean) {
        super(bilan);
        this.pNom = estBilanDesVisibles ? 'BV' : 'B';
        this.pCellules = [];
        const colonnesAvecBilan = bilan.vueTable.colonnes.filter(colonne => !!colonne.bilanDef);
        let indexColonneAvecBilanPrécédente = -1;
        let indexDansColonnesAvecBilan = 0;
        while (indexDansColonnesAvecBilan < colonnesAvecBilan.length) {
            const colonne = bilan.vueTable.colonnes[indexColonneAvecBilanPrécédente + 1];
            const colonneAvecBilan = colonnesAvecBilan[indexDansColonnesAvecBilan];
            // une colonne sans bilan qui est la première colonne ou qui suit une colonne avec bilan contient une cellule qui s'étend jusqu'à la colonne avec bilan suivante
            // ou jusqu'à la dernière colonne s'il n'y a pas de colonne avec bilan suivante
            // toutes les colonnes entre deux colonnes avec bilan forme une seule cellule contenant le titre du bilan de la seconde
            this.pCellules.push(new KfVueTableCelluleBilan<T>(colonne, this, colonneAvecBilan),
            new KfVueTableCelluleBilan<T>(colonneAvecBilan, this, colonneAvecBilan));
            indexColonneAvecBilanPrécédente = colonneAvecBilan.index;
            indexDansColonnesAvecBilan++;
        }
        if (indexColonneAvecBilanPrécédente < bilan.vueTable.colonnes.length - 1) {
            // il y a des colonnes aprés la dernière colonne avec bilan
            bilan.vueTable.colonnes.filter(colonne => colonne.index > indexColonneAvecBilanPrécédente)
                .forEach(colonne => this.pCellules.push(new KfVueTableCelluleBilan<T>(colonne, this)));
        }
        if (estBilanDesVisibles) {
            this.géreCss.ajouteClasse({ nom: 'kf-invisible', active: () => !bilan.vueTable.estFiltrée })
        }
    }

    get nom(): string {
        return this.pNom;
    }

    /**
     * Vrai si la ligne fait le bilan des seules lignes visibles.
     */
    get estBilanDesVisibles(): boolean {
        return this.nom === 'BV';
    }

    /**
     * Mise à jour des textes des contenus des cellules avec bilan.
     */
    quandBilanChange() {
        this.pCellules.forEach(c => (c as KfVueTableCelluleBilan<T>).quandBilanChange());
    }

}
