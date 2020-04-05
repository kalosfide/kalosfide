import { ComptePages } from 'src/app/compte/compte-pages';
import { ApiResult } from './api-result';
import { AppPages } from 'src/app/app-pages';

export class ApiResult401Unauthorized extends ApiResult {
    static code = 401;

    constructor() {
        super(401);
        this.routeErreur = [AppPages.compte.urlSegment, ComptePages.connection.urlSegment];
        this.routeErreurAbsolue = true;
    }
}
