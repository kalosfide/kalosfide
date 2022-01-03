

import { DataKeyService } from '../data-key.service';
import { KeyIdNo } from './key-id-no';
import { IKeyIdNo } from './i-key-id-no';

export abstract class KeyIdNoService<T extends KeyIdNo> extends DataKeyService<T> {

    urlSegmentDeKey = (t: T): string => {
        return KeyIdNo.texteDeKey(t);
    }

    créeParams(objet: IKeyIdNo): { [param: string]: string } {
        const params: { [param: string]: string } = {};
        return {
            id: '' + objet.id,
            no: '' + objet.no,
        };
    }
}
