import { ApiResult } from './api-result';
import { ApiErreur400 } from './api-erreur-400';

export class ApiResult400BadRequest extends ApiResult {
    static code = 400;

    apiErreurs: ApiErreur400[];
    constructor(
        validationErrors: { [keys: string]: string[] }
    ) {
        super(400);
        this.apiErreurs = Object.keys(validationErrors).map(key => {
            const v = validationErrors[key];
            return {
                champ: key,
                code: validationErrors[key][0]
            };
        });
    }
}
