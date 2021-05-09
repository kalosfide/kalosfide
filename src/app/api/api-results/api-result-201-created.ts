import { ApiResult } from './api-result';

export class ApiResult201Created extends ApiResult {
    static code = 201;

    entity: any;
    constructor(créé: any) {
        super(201);
        this.ok = true;
        this.entity = créé;
    }
}
