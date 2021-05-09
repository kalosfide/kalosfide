import { ApiResultErreur } from './api-result-erreur';

export class ApiResult404NotFound extends ApiResultErreur {
    static code = 404;

    constructor(
    ) {
        super(404);
        this.titre = 'Ressources introuvables';
        this.messages = ['Les ressource demandées sont introuvables.'];
    }
}
