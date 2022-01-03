import { DataKeyUtile } from '../data-key-utile';
import { KeyIdNoService } from './key-id-no.service';
import { KeyIdNo } from './key-id-no';

export class KeyUidRnoNoUtile<T extends KeyIdNo> extends DataKeyUtile<T> {
    constructor(service: KeyIdNoService<T>) {
        super(service);
    }

    get service(): KeyIdNoService<T> {
        return this.pService as KeyIdNoService<T>;
    }
}
