import { ApiResult } from './api-result';

export class ApiResult201Created extends ApiResult {
    static code = 201;

    actionLit: string;
    idObject: { id: string | number };
    entity: any;
    constructor(
    ) {
        super(201);
        this.ok = true;
    }
}
