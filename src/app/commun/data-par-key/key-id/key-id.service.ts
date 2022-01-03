

import { DataKeyService } from '../data-key.service';
import { KeyId } from './key-id';
import { IDataKey } from '../data-key';
import { IKeyId } from './i-key-id';

export abstract class KeyIdService<T extends KeyId> extends DataKeyService<T> {

    urlSegmentDeKey = (t: T): string => {
        return '' + t.id;
    }

    créeParams(objet: IDataKey): { [param: string]: string } {
        const key = objet as IKeyId;
        return  {
            id: '' + key.id,
        };
    }
}
