import { IKeyIdNo } from './i-key-id-no';

export abstract class KeyIdNo implements IKeyIdNo {
    id: number;
    no: number;

    static créeParams(key: IKeyIdNo): { [param: string]: string } {
        return {
            'id': '' + key.id,
            'no': '' + key.no,
        };
    }

    static copieKey(de: IKeyIdNo, vers: IKeyIdNo) {
        vers.id = de.id;
        vers.no = de.no;
    }

    static texteDeKey(key: IKeyIdNo): string {
        return '' + key.id + '-' + key.no;
    }
    static keyDeTexte(texte: string): IKeyIdNo {
        const els = texte.split('-');
        if (els.length === 2) {
            return {
                id: +els[0],
                no: +els[1]
            };
        }
    }

    static compareKey(key1: IKeyIdNo, key2: IKeyIdNo): boolean {
        return key1.id === key2.id && key1.no === key2.no;
    }
}
