import { ComptePages } from 'src/app/compte/compte-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ApiResultErreur } from './api-result-erreur';

export class ApiResult401Unauthorized extends ApiResultErreur {
    static code = 401;

    urlConnection: string;
    lienConnection: string;

    constructor(erreur?: any) {
        super(401);
        this.titre = `Vous n'êtes pas connecté`;
        if (erreur && erreur.message) {
            this.messages = [`Vous avez été déconnecté car il y a eu une autre connection avec vos identifiants.`];
        }

        this.urlConnection = Fabrique.url.appRouteur.compte.url(ComptePages.connection.path);
        this.lienConnection = 'Connection';
    }
}
