import { ApiResult } from './api-result';

export class ApiResult423Locked extends ApiResult {
    static code = 423;

    private pErreur: any;

    constructor(erreur: any) {
        super(423);
        this.pErreur = erreur;
        this.ok = true;
    }
    get erreur(): any {
        return this.pErreur;
    }
}
