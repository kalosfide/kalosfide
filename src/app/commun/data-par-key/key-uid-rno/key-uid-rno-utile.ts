import { DataKeyUtile } from '../data-key-utile';
import { KeyUidRnoService } from './key-uid-rno.service';
import { KeyUidRno } from './key-uid-rno';

export class KeyUidRnoUtile<T extends KeyUidRno> extends DataKeyUtile<T> {
    constructor(service: KeyUidRnoService<T>) {
        super(service);
    }

    get service(): KeyUidRnoService<T> {
        return this.pService as KeyUidRnoService<T>;
    }
}
