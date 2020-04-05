

import { DataKeyService } from '../data-key.service';
import { KeyUidRno } from './key-uid-rno';
import { IDataKey } from '../data-key';
import { IKeyUidRno } from './i-key-uid-rno';

export abstract class KeyUidRnoService<T extends KeyUidRno> extends DataKeyService<T> {

    urlSegmentDeKey = (t: T): string => {
        return '' + t.rno;
    }

    get keyDeAjoute(): IKeyUidRno {
        const enCours = this.keyIdentifiant;
        const key = {
            uid: enCours.uid,
            rno: -1
        };
        return key;
    }

    fixeKeyDeAjoute(envoyé: T, reçu: T) {
        envoyé.rno = reçu.rno;
    }

    créeParams(objet: IDataKey): { [param: string]: string } {
        const key = objet as IKeyUidRno;
        return key.rno ? {
            uid: key.uid,
            rno: '' + key.rno,
        } : {
            uid: key.uid,
        };
    }
}
