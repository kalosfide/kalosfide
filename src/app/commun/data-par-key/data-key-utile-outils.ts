import { IDataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { KfVueTableOutilBtnGroupe } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil-btn-group';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class DataKeyUtileOutils<T extends IDataKey> {
    protected _utile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this._utile = utile;
    }

    outilAjoute(): KfVueTableOutilBtnGroupe<T> {
        return Fabrique.vueTable.outilAjoute(this._utile.lienKey.ajoute());
    }
}
