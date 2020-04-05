import { DataKeyUtile } from '../data-key-utile';
import { KeyUidRnoNoService } from './key-uid-rno-no.service';
import { KeyUidRnoNo } from './key-uid-rno-no';

export class KeyUidRnoNoUtile<T extends KeyUidRnoNo> extends DataKeyUtile<T> {
    constructor(service: KeyUidRnoNoService<T>) {
        super(service);
    }

    get service(): KeyUidRnoNoService<T> {
        return this.pService as KeyUidRnoNoService<T>;
    }
}
