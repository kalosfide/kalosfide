import { ApiResultErreur } from './api-result-erreur';

export class ApiResult409Conflict extends ApiResultErreur {
    static code = 409;

    private pErreur: any;

    constructor(erreur?: any) {
        super(409);
        this.titre = 'Ressources verrouillées';
        this.messages = [`Les ressource demandées sont verrouillées car en cours d'utilisation.`];
        this.pErreur = erreur;
    }

    get erreur(): any {
        return this.pErreur;
    }
}
