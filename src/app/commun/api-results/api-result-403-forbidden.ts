import { AppPages } from 'src/app/app-pages';
import { ApiResult } from './api-result';

export class ApiResult403Forbidden extends ApiResult {
    static code = 403;

    constructor() {
        super(403);
        this.routeErreur = [AppPages.interdit.urlSegment];
    }
}
