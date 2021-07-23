import { IDataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';

export class DataKeyUtileColonne<T extends IDataKey> {
    protected pUtile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this.pUtile = utile;
    }

    edite(): IKfVueTableColonneDef<T> {
        return {
            nom: 'edite',
            créeContenu: (t: T) => this.pUtile.lienKey.edite(t),
            afficherSi: this.pUtile.conditionTable.edition,
        };
    }
    supprime(): IKfVueTableColonneDef<T> {
        return {
            nom: 'supprime',
            créeContenu: (t: T) => this.pUtile.lienKey.supprime(t),
            afficherSi: this.pUtile.conditionTable.edition,
        };
    }
}
