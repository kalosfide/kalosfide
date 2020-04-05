import { ApiResult } from './api-result';
import { AppPages } from 'src/app/app-pages';

export class ApiResult409Conflict extends ApiResult {
    static code = 409;

    private pErreur: any;

    constructor(erreur?: any) {
        super(409);
        this.routeErreur = [AppPages.conflit.urlSegment];
        this.pErreur = erreur;
    }

    get erreur(): any {
        return this.pErreur;
    }
}
