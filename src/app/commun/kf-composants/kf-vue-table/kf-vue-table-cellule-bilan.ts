import { KfVueTableColonne } from './kf-vue-table-colonne';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { IKfVueTableCellule, KfVueTableCelluleBase } from './kf-vue-table-cellule-base';
import { KfVueTableLigneBilan } from './kf-vue-table-ligne-bilan';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';

export class KfVueTableCelluleBilan<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {
    /**
     * Mise à jour du texte du contenu si la cellule est une cellule avec bilan.
     */
    private pQuandBilanChange: () => void;

    constructor(colonne: KfVueTableColonne<T>, ligne: KfVueTableLigneBilan<T>, colonneAvecBilanSuivante?: KfVueTableColonne<T>) {
        super(colonne, ligne);
        this.thScope = 'col';
        if (!colonneAvecBilanSuivante) {
            // c'est une cellule qui suit la dernière cellule avec bilan
            this.créeContenu('');
            return;
        }
        if (colonneAvecBilanSuivante === colonne) {
            // c'est une cellule avec bilan
            this.créeContenu('');
            this.quandBilanChange = () => {
                const texteAgrégé = colonne.bilanDef.texteAgrégé;
                if (texteAgrégé) {
                    const lignesAAgréger = (this.pLigne as KfVueTableLigneBilan<T>).estBilanDesVisibles
                        ? this.vueTable.corps.lignesVisibles : this.vueTable.corps.lignes;
                    const texteDef = () => texteAgrégé(lignesAAgréger.map(l => l.item));
                    this.pContenu.fixeTexte(texteDef);
                }
            }
            return;
        }
        // c'est une cellule qui précède une cellule de bilan qui a un titre
        // elle s'étale sur toutes les colonnes qui suivent la cellule de bilan précédente
        const bilanSuivant = colonneAvecBilanSuivante.bilanDef;
        const titre = ligne.estBilanDesVisibles && bilanSuivant.titreBilanDesVisibles
            ? bilanSuivant.titreBilanDesVisibles
            : bilanSuivant.titreDef
                ? bilanSuivant.titreDef
                : '';
        this.créeContenu(titre);
        this.pColSpan = () => colonne.vueTable.colonnes
            .filter(col => col.index >= colonne.index && col.index < colonneAvecBilanSuivante.index && !col.nePasAfficher)
            .length;
    }

    get classe(): KfNgClasse {
        return this.pColonne.classeBilan;
    }

    quandBilanChange() {
        if (this.pQuandBilanChange) {
            this.pQuandBilanChange();
        }
    }
}
