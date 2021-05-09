import { ComptePages, CompteRoutes } from 'src/app/compte/compte-pages';
import { AppPages } from 'src/app/app-pages';
import { ApiResultErreur } from './api-result-erreur';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';

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

        this.urlConnection = AppSiteRoutes.url([AppPages.compte.urlSegment, ComptePages.connection.urlSegment]);
        this.lienConnection = 'Connection';
    }
}
