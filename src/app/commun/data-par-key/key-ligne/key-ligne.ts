import { IKeyLigne } from './i-key-ligne';

export class KeyLigne implements IKeyLigne {
    id: number;
    no: number;
    produitId: number;
    date: Date;

    static créeParams(key: IKeyLigne): { [param: string]: string } {
        return {
            'id': '' + key.id,
            'no': '' + key.no,
            'id2': '' + key.produitId,
            'date': new Date(key.date).toISOString(),
        };
    }

    static copieKey(de: IKeyLigne, vers: IKeyLigne) {
        vers.id = de.id;
        vers.no = de.no;
        vers.produitId = de.produitId;
        vers.date = de.date
    }
}
