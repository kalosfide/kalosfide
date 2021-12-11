

import { DataKeyService } from '../data-key.service';
import { KeyUidRnoNo } from './key-uid-rno-no';
import { IKeyUidRnoNo } from './i-key-uid-rno-no';
import { IDataKey } from '../data-key';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { KeyUidRno } from '../key-uid-rno/key-uid-rno';
import { ApiAction } from '../../../api/api-route';

export abstract class KeyUidRnoNoService<T extends KeyUidRnoNo> extends DataKeyService<T> {

    urlSegmentDeKey = (t: T): string => {
        return '' + t.no;
    }

    créeParams(objet: IDataKey): { [param: string]: string } {
        const key = objet as IKeyUidRnoNo;
        const params: { [param: string]: string } = {};
        if (key.uid) { params.uid = key.uid; }
        return key.no
            ? {
                uid: key.uid,
                rno: '' + key.rno,
                no: '' + key.no,
            }
            : key.rno
                ? {
                    uid: key.uid,
                    rno: '' + key.rno,
                }
                : {
                    uid: key.uid,
                };
    }

    dernierNo(key: KeyUidRno): Observable<ApiResult> {
        return this.get<number>(this.controllerUrl, ApiAction.data.dernierNo, this.créeParams(key));
    }
}
