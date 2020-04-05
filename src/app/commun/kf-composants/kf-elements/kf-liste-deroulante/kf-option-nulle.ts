import { KfOptionBase } from './kf-option-base';

export class KfOptionNulle extends KfOptionBase {
    constructor() {
        super();
    }

    get valeur(): string {
        return undefined;
    }
}
