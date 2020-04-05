import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';

export class KeyUidRnoNo2 implements IKeyUidRnoNo2 {
    uid: string;
    rno: number;
    no: number;
    uid2: string;
    rno2: number;
    no2: number;

    static créeParams(key: IKeyUidRnoNo2): { [param: string]: string } {
        return {
            'uid': key.uid,
            'rno': '' + key.rno,
            'no': '' + key.no,
            'uid2': key.uid2,
            'rno2': '' + key.rno2,
            'no2': '' + key.no2,
        };
    }

    static copieKey(de: IKeyUidRnoNo2, vers: IKeyUidRnoNo2) {
        vers.uid = de.uid;
        vers.rno = de.rno;
        vers.no = de.no;
        vers.uid2 = de.uid2;
        vers.rno2 = de.rno2;
        vers.no2 = de.no2;
    }
}
