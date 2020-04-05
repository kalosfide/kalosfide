import { KfVueTable } from './kf-vue-table';
import { KfVueTableCelluleBase, IKfVueTableCellule, IKfVueTableCelluleDef, KfVueTableCelluleDef } from './kf-vue-table-cellule';
import { KfVueTableColonne } from './kf-vue-table-colonne';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';
import { KfVueTableLigneBase, IKfVueTableLigne } from './kf-vue-table-ligne';

export class KfVueTableCelluleEnTete<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>) {
        super(vueTable, colonne, colonne.index);
        this.thScope = 'col';
    }

    /**
     * Crée le contenu à partir du titreDef de l'en-tête de la colonne
     */
    créeContenu() {
        this.pComposant = this.créeComposant(this.colonne.enTeteDef ? this.colonne.enTeteDef.titreDef : undefined);
        this.pComposant.ajouteClasseDef('kf-vue-table-en-tete');
        if (this.colonne.tri) {
            this.vueTable.trieurs.ajouteTri(this);
        }
    }

    /**
     * Crée le contenu à partir du chapeauDef de l'en-tête de la colonne
     */
    créeContenuChapeau() {
        this.pComposant = this.créeComposant(this.colonne.enTeteDef.chapeauDef);
        this.composant.ajouteClasseDef('kf-vue-table-en-tete');
    }

    /**
     * classe à ajouter à l'élément th de l'en-tête
     */
    get classe(): KfNgClasse {
        return this.pColonne.classeEntete;
    }
}

export class KfVueTableLigneEnTete<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {


    constructor(vueTable: KfVueTable<T>) {
        super(vueTable);
        this.pCellules = [];
    }

    ajoute(cellule: KfVueTableCelluleEnTete<T>) {
        this.pCellules.push(cellule);
    }

}

export class KfVueTableEnTete<T> {
    lignes: KfVueTableLigneEnTete<T>[];

    constructor(vueTable: KfVueTable<T>) {
        const colonnes = vueTable.colonnes;
        const ligne = new KfVueTableLigneEnTete<T>(vueTable);
        let ligneSousChapeau: KfVueTableLigneEnTete<T>;
        // il y a une ligne sous chapeau si l'une des colonnes a un en-tête avec chapeau
        if (colonnes.find(c => c.enTeteDef !== undefined && c.enTeteDef.chapeauDef !== undefined) !== undefined) {
            ligneSousChapeau = new KfVueTableLigneEnTete<T>(vueTable);
        }
        let index = 0;
        let def: IKfVueTableEnTeteDef;
        let dernierDuGroupe = -1;
        let cellule: KfVueTableCelluleEnTete<T>;
        const nb = colonnes.length;
        while (index < nb) {
            def = colonnes[index].enTeteDef;
            cellule = new KfVueTableCelluleEnTete<T>(vueTable, vueTable.colonnes[index]);
            if (def && def.chapeauDef && def.longueurChapeau >= 1) {
                // Crée le contenu à partir du chapeauDef de l'en-tête de la colonne
                cellule.créeContenuChapeau();
                cellule.colSpan = def.longueurChapeau;
                ligne.ajoute(cellule);
                cellule = new KfVueTableCelluleEnTete<T>(vueTable, vueTable.colonnes[index]);
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
            this.lignes = [ligne, ligneSousChapeau];
        } else {
            this.lignes = [ligne];
        }
    }

}
