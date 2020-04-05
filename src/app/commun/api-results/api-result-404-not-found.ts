import { AppPages } from 'src/app/app-pages';
import { ApiResult } from './api-result';

export class ApiResult404NotFound extends ApiResult {
    static code = 404;

    constructor(
    ) {
        super(404);
        this.routeErreur = [AppPages.introuvable.urlSegment];
    }
}
