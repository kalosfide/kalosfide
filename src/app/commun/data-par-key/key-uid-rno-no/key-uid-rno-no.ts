import { IKeyUidRnoNo } from './i-key-uid-rno-no';
import { KeyUidRno } from '../key-uid-rno/key-uid-rno';

export abstract class KeyUidRnoNo implements IKeyUidRnoNo {
    uid: string;
    rno: number;
    no: number;

    static créeParams(key: IKeyUidRnoNo): { [param: string]: string } {
        return {
            'uid': key.uid,
            'rno': '' + key.rno,
            'no': '' + key.no,
        };
    }

    static copieKey(de: IKeyUidRnoNo, vers: IKeyUidRnoNo) {
        vers.uid = de.uid;
        vers.rno = de.rno;
        vers.no = de.no;
    }

    static texteDeKey(key: IKeyUidRnoNo): string {
        return key.uid + '-' + key.rno + '-' + key.no;
    }
    static keyDeTexte(texte: string): IKeyUidRnoNo {
        const els = texte.split('-');
        if (els.length === 3) {
            return {
                uid: els[0],
                rno: +els[1],
                no: +els[2]
            };
        }
    }

    static compareKey(key1: IKeyUidRnoNo, key2: IKeyUidRnoNo): boolean {
        return key1.uid === key2.uid && key1.rno === key2.rno && key1.no === key2.no;
    }
}

export interface IKeyUidRnoNoData {
    no: number;
}

export interface GroupeUidRnoNo extends KeyUidRno {
    liste: IKeyUidRnoNoData[];
}
