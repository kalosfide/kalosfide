import { AppPages } from 'src/app/app-pages';
import { PageDef } from 'src/app/commun/page-def';
import { ApiResult } from './api-result';

export abstract class ApiResultErreur extends ApiResult {
    titre: string;
    messages: string[];
    // pour toutes sauf 400 et 401, redirection vers la page modale
    // ou le component correspondant de l'AppSite ou de la section client ou fournisseur du site en cours

    protected constructor(statusCode: number) {
        super(statusCode);
    }
}

export class ApiResultErreurSpéciale extends ApiResultErreur {

    constructor(statusCode: number, titre: string, ...messages: string[]) {
        super(statusCode);
        this.titre = titre;
        this.messages = messages;
    }
}
