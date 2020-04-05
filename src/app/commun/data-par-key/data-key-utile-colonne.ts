import { IDataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';

export class DataKeyUtileColonne<T extends IDataKey> {
    protected _utile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this._utile = utile;
    }

    edite(): IKfVueTableColonneDef<T> {
        return {
            nom: 'edite',
            créeContenu: (t: T) => ({ composant: this._utile.lienKey.edite(t) }),
            nePasAfficherSi: this._utile.conditionTable.pasEdition
        };
    }
    supprime(): IKfVueTableColonneDef<T> {
        return {
            nom: 'supprime',
            créeContenu: (t: T) => ({ composant: this._utile.lienKey.supprime(t) }),
            nePasAfficherSi: this._utile.conditionTable.pasEdition
        };
    }
}
