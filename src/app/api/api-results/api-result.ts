export class ApiResult {
    /**
     * statusCode de la response de la requête Http
     */
    statusCode: number;
    ok: boolean;

    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }

}
