import { ApiResult } from './api-result';

export class ApiResult204NoContent extends ApiResult {
    static code = 204;

    constructor(
    ) {
        super(204);
        this.ok = true;
    }
}
