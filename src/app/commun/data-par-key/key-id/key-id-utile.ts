import { DataKeyUtile } from '../data-key-utile';
import { KeyIdService } from './key-id.service';
import { KeyId } from './key-id';

export class KeyIdUtile<T extends KeyId> extends DataKeyUtile<T> {
    constructor(service: KeyIdService<T>) {
        super(service);
    }

    get service(): KeyIdService<T> {
        return this.pService as KeyIdService<T>;
    }
}
