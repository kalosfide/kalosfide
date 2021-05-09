import { ApiResultErreur } from './api-result-erreur';

export class ApiResult500InternalServerError extends ApiResultErreur {
    static code = 500;

    constructor() {
        super(500);
        this.titre = 'Erreur du serveur';
        this.messages = [`Le serveur semble indisponible.`, `Veuillez réessayer ultérieument.`];
    }
}
