import { IKeyUidRno } from './i-key-uid-rno';

export abstract class KeyUidRno implements IKeyUidRno {
    uid: string;
    rno: number;

    static créeParams(key: IKeyUidRno): { [param: string]: string } {
        return {
            uid: key.uid,
            rno: '' + key.rno,
        };
    }

    static copieKey(de: IKeyUidRno, vers: IKeyUidRno) {
        vers.uid = de.uid;
        vers.rno = de.rno;
    }

    static texteDeKey(key: IKeyUidRno): string {
        return key.uid + '-' + key.rno;
    }

    static keyDeTexte(texte: string): IKeyUidRno {
        const segments: string[] = texte.split('-');
        try {
            return {
                uid: segments[0],
                rno: Number.parseInt(segments[1], 10),
            };
        } catch (error) {
        }
    }

    static compareKey(key1: IKeyUidRno, key2: IKeyUidRno): boolean {
        return key1.uid === key2.uid && key1.rno === key2.rno;
    }

    static aMêmeKey(key1: IKeyUidRno, key2: IKeyUidRno): boolean {
        if (!key1) {
            return !key2;
        }
        if (!key2) {
            return false;
        }
        return key1.uid === key2.uid && key1.rno === key2.rno;
    }
}
