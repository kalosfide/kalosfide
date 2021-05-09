import { ApiResultErreur } from './api-result-erreur';

export class ApiResult403Forbidden extends ApiResultErreur {
    static code = 403;

    constructor() {
        super(403);
        this.titre = 'Accès refusé';
        this.messages = [`L'accès à ces ressources est réservé.`];
    }
}
