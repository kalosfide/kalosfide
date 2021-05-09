import { KfVueTable } from './kf-vue-table';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';
import { KfVueTableLigneEnTete } from './kf-vue-table-ligne-en-tete';
import { KfVueTableCelluleEnTete } from './kf-vue-table-cellule-en-tete';
import { KfVueTableSectionBase } from './kf-vue-table-section-base';
import { IKfVueTableLigne } from './kf-vue-table-ligne-base';

export class KfVueTableEnTete<T> extends KfVueTableSectionBase<T> {

    constructor(vueTable: KfVueTable<T>) {
        super(vueTable);
        const colonnes = vueTable.colonnes;
        const ligne = new KfVueTableLigneEnTete<T>(this);
        let ligneSousChapeau: KfVueTableLigneEnTete<T>;
        // il y a une ligne sous chapeau si l'une des colonnes a un en-tête avec chapeau
        if (colonnes.find(c => c.enTeteDef !== undefined && c.enTeteDef.chapeauDef !== undefined) !== undefined) {
            ligneSousChapeau = new KfVueTableLigneEnTete<T>(this, true);
        }
        let index = 0;
        let def: IKfVueTableEnTeteDef;
        let dernierDuGroupe = -1;
        let cellule: KfVueTableCelluleEnTete<T>;
        const nb = colonnes.length;
        while (index < nb) {
            def = colonnes[index].enTeteDef;
            cellule = new KfVueTableCelluleEnTete<T>(vueTable.colonnes[index], ligne);
            if (def && def.chapeauDef && def.longueurChapeau >= 1) {
                // Crée le contenu à partir du chapeauDef de l'en-tête de la colonne
                cellule.créeContenuChapeau();
                cellule.colSpan = def.longueurChapeau;
                ligne.ajoute(cellule);
                cellule = new KfVueTableCelluleEnTete<T>(vueTable.colonnes[index], ligneSousChapeau);
                cellule.créeContenu();
                ligneSousChapeau.ajoute(cellule);
                dernierDuGroupe = index + def.longueurChapeau - 1;
            } else {
                cellule.créeContenu();
                if (ligneSousChapeau) {
                    if (index <= dernierDuGroupe) {
                        ligneSousChapeau.ajoute(cellule);
                    } else {
                        cellule.rowSpan = 2;
                        ligne.ajoute(cellule);
                    }
                } else {
                    ligne.ajoute(cellule);
                }
            }
            index++;
        }
        if (ligneSousChapeau) {
            this.pLignes = [ligne, ligneSousChapeau];
        } else {
            this.pLignes = [ligne];
        }
    }

    get lignes(): KfVueTableLigneEnTete<T>[] {
        return this.pLignes.map(l => l as KfVueTableLigneEnTete<T>)
    }

    get lignesVisibles(): KfVueTableLigneEnTete<T>[] {
        return this.pLignes.map(l => l as KfVueTableLigneEnTete<T>)
    }

}
