import { Observable, of, EMPTY } from 'rxjs';
import { ApiResult } from '../api/api-results/api-result';
import { AfficheResultat } from '../disposition/affiche-resultat/affiche-resultat';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';

export class ApiRequêteAction {
    /**
     * Requête POST, PUT ou DELETE envoyée à l'Api.
     */
    demandeApi: () => Observable<ApiResult>;
    /**
     * Action à éxécuter si la réponse est Ok.
     */
    actionSiOk: (créé?: any) => void;
    /**
     * Si présent, spinner à afficher pendant l'attente du résultat de demandeApi.
     * Si absent, le spinner global est utilisé.
     */
    attente?: { commence: () => void; finit: () => void };
    /**
     * Si présent, formulaire contenant les champs auxquels attribuer les erreurs BadRequest.
     */
    formulaire?: KfGroupe;
    /**
     * Si présent, affiche le résultat de la requête si ce n'est pas l'erreur 401 Unautorized.
     * Si absent, une erreur autre que 401 est affichée dans une fenêtre modale
     * Dans tous les cas, l'erreur 401 Unautorized entraine une redirection vers la page d'erreur correspondante.
     */
    afficheResultat?: AfficheResultat;
    /**
     * Si présent et si afficheResultat, titre à afficher si la réponse a une erreur.
     */
    titreErreur?: string;
    /**
     * Si présent et si afficheResultat, titre à afficher si la réponse est Ok.
     */
    titreSucces?: string;
    /**
     * Si présent, et si retourne true, l'erreur n'est pas affichée et n'entraine pas de redirection vers une page d'erreur.
     */
    traiteErreur?: (apiResult: ApiResult) => boolean;

    /**
     * Si présent, est appelé avant le traitement par défaut des ApiResult
     */
    convertitResult?: (apiResult: ApiResult) => ApiResult;
}
