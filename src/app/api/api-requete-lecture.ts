import { Observable, of, EMPTY } from 'rxjs';
import { ApiResult } from '../api/api-results/api-result';

export class ApiRequêteLecture {
    /**
     * Requête GET envoyée à l'Api.
     */
    demandeApi: () => Observable<ApiResult>;

    /**
     * Si présent, est appelé avant le traitement par défaut des ApiResult,
     * pour pouvoir appliquer un taitement particulier à une erreur
     */
     convertitResult?: (apiResult: ApiResult) => ApiResult;

     /**
     * Si présent, spinner à afficher pendant l'attente du résultat de demandeApi.
     * Si absent, le spinner global est utilisé.
     */
    attente?: { commence: () => void; finit: () => void };
}
