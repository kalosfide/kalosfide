import { Observable, of, EMPTY } from 'rxjs';
import { ApiResult } from '../api/api-results/api-result';

export class ApiRequêteLecture {
    /**
     * Requête GET envoyée à l'Api.
     */
    demandeApi: () => Observable<ApiResult>;
    /**
     * Si présent et si retourne true, l'erreur n'entraine pas de redirection vers une page d'erreur.
     */
    traiteErreur?: (apiResult: ApiResult) => boolean;
    /**
     * Si présent, spinner à afficher pendant l'attente du résultat de demandeApi.
     * Si absent, le spinner global est utilisé.
     */
    attente?: { commence: () => void; finit: () => void };
}
