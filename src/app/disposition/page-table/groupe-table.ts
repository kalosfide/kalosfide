import { IEtatTableDef, EtatTable } from '../fabrique/etat-table';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from '../fabrique/fabrique';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';

export interface IGroupeTableDef<T> {
    vueTableDef: IKfVueTableDef<T>;
    avantTable?: () => KfGroupe;
    apresTable?: () => KfGroupe;
    etatTable?: EtatTable;
}

export class GroupeTable<T> {
    avantTable: KfGroupe;
    groupeOutils: KfGroupe;
    groupeTable: KfGroupe;
    vueTable: KfVueTable<T>;
    apresTable: KfGroupe;

    etat: EtatTable;

    constructor(groupeTableDef: IGroupeTableDef<T>) {
        this.vueTable = Fabrique.vueTable.vueTable('', groupeTableDef.vueTableDef);
        if (groupeTableDef.avantTable) {
            this.avantTable = groupeTableDef.avantTable();
        }
        if (groupeTableDef.apresTable) {
            this.apresTable = groupeTableDef.apresTable();
        }
        if (groupeTableDef.etatTable) {
            this.etat = groupeTableDef.etatTable;
            if (groupeTableDef.etatTable.nePasAfficherSiPasVide) {
                const estVide: () => boolean = (() => {
                    return this.vueTable.estVide;
                }).bind(this);
                this.etat.groupe.visibilitéFnc = estVide;
                let composants: KfComposant[] = [];
                if (this.avantTable) {
                    composants = composants.concat(this.avantTable);
                }
                composants = composants.concat([this.vueTable]);
                if (this.apresTable) {
                    composants = composants.concat(this.apresTable);
                }
                composants.forEach(c => c.invisibilitéFnc = estVide);
            }
        }
        return this;
    }

    ajouteA(groupe: KfGroupe) {
        if (this.avantTable) {
            groupe.ajoute(this.avantTable);
        }

        if (this.etat) {
            groupe.ajoute(this.etat.groupe);
        }

        groupe.ajoute(this.vueTable);

        if (this.apresTable) {
            groupe.ajoute(this.apresTable);
        }
    }

}
