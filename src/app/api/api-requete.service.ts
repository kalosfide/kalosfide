import { Injectable } from '@angular/core';
import { map, delay, tap, catchError, concatMap } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiRequêteAction } from './api-requete-action';
import { KfNgbModalService } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal.service';
import { KfValidateur } from '../commun/kf-composants/kf-partages/kf-validateur';
import { FabriqueFormulaire } from '../disposition/fabrique/fabrique-formulaire';
import { ApiRequêteLecture } from './api-requete-lecture';
import { of, Observable } from 'rxjs';
import { IResultatAffichable, ResultatAction } from '../disposition/affiche-resultat/resultat-affichable';
import { AttenteService } from '../services/attente.service';
import { NavigationService } from '../services/navigation.service';
import { RouteurService } from '../services/routeur.service';
import { ApiErreur400 } from './api-results/api-erreur-400';
import { ApiResult } from './api-results/api-result';
import { ApiResult200Ok } from './api-results/api-result-200-ok';
import { ApiResult201Created } from './api-results/api-result-201-created';
import { ApiResult204NoContent } from './api-results/api-result-204-no-content';
import { ApiResult400BadRequest } from './api-results/api-result-400-bad-request';
import { ApiResult401Unauthorized } from './api-results/api-result-401-unauthorized';
import { ApiResult403Forbidden } from './api-results/api-result-403-forbidden';
import { ApiResult404NotFound } from './api-results/api-result-404-not-found';
import { ApiResult409Conflict } from './api-results/api-result-409-conflict';
import { ApiResultErreur, ApiResultErreurSpéciale } from './api-results/api-result-erreur';
import { ApiResult500InternalServerError } from './api-results/api-result-500-internal-server-error';
import { IAvecServices } from '../services/i-avec-services';
import { Fabrique } from '../disposition/fabrique/fabrique';

@Injectable()
export class ApiRequêteService implements IAvecServices {

    constructor(
        private http: HttpClient,
        private config: ApiConfigService,
        private pIdentification: IdentificationService,
        private pRouteur: RouteurService,
        private pNavigation: NavigationService,
        private pModal: KfNgbModalService
    ) {
    }

    get identification(): IdentificationService { return this.pIdentification; }
    get routeur(): RouteurService { return this.pRouteur; }
    get navigation(): NavigationService { return this.pNavigation; }
    get attenteService(): AttenteService { return this.pNavigation.attenteService; }
    get modalService(): KfNgbModalService { return this.pModal; }

    protected headers(): HttpHeaders {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return headers;
    }

    /**
     * Transforme la réponse en ApiResult avec erreur suivant son status
     * @param response HttpErrorResponse de la requête Http
     */
    protected handleError(response: HttpErrorResponse) {
        console.log(response);
        const error = response.error;
        let apiResult: ApiResult;
        if (error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.message);
            apiResult = new ApiResultErreurSpéciale(response.status, 'An error occurred', error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${response.status}, ` +
                `body was: ${response.error}`);
            switch (response.status) {
                case ApiResult400BadRequest.code:
                    // Les paramètres la requête ont été vérifiées donc, après débogage, sont valides.
                    // Une réponse BadRequest ne peut se produire en utilisant les liens et boutons des pages
                    // que si la validité d'un formulaire dépend du contexte de l'Api et que ce contexte ne peut pas être chargé
                    // avant validation ou qu'il a changé depuis son chargement.
                    // Dans ce cas, error est de type { [keys: string]: string[] } avec
                    console.log(error);
                    apiResult = new ApiResult400BadRequest(error);
                    break;
                case ApiResult401Unauthorized.code:
                    // Une réponse Unauthorized ne peut se produire que si l'utilisateur n'est pas identifié
                    // ou si une autre connection a eu lieu avec les mêmes identifiants à partir d'un autre ordinateur
                    // Dans ce cas, error est { message = 'Session terminée' }
                    apiResult = new ApiResult401Unauthorized(error);
                    /// IMPORTANT efface les stocks d'identification
                    this.pIdentification.déconnecte();
                    break;
                case ApiResult403Forbidden.code:
                    // Une réponse Forbidden ne peut pas se produire en utilisant les liens et boutons des pages
                    apiResult = new ApiResult403Forbidden();
                    break;
                case ApiResult404NotFound.code:
                    // Une réponse NotFound ne peut pas se produire en utilisant les liens et boutons des pages
                    // car seul le propriétaire des données peut les modifier (Unauthorized) et un utilisateur de
                    // données dont il n'est pas propriétaire reçoit une réponse Conflict si ces données ont été modifiées
                    apiResult = new ApiResult404NotFound();
                    break;
                case ApiResult409Conflict.code:
                    // Une réponse Conflict ne peut se produire en utilisant les liens et boutons des pages
                    // que si l'utilisateur n'est pas propriétaire des données qu'il utilise et que ces données ont été modifiées
                    apiResult = new ApiResult409Conflict(error);
                    break;
                case ApiResult500InternalServerError.code:
                    apiResult = new ApiResult500InternalServerError();
                    break;
                default:
                    const errMsg = response.message
                        ? response.message
                        : `Le serveur semble indisponible. Veuillez réessayer ultérieument.`;
                    apiResult = new ApiResultErreurSpéciale(response.status, 'Erreur non gérée', errMsg);
                    break;
            }
        }
        console.log('apiResult', apiResult);

        return of(apiResult);
    }

    public post<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this.http.post(this.config.route(controller, action), body, {
            headers: this.headers(),
            withCredentials: true,
            params,
            observe: 'response'
        }).pipe(
            tap(res => console.log('post', res, res.headers.keys())),
            map(res => {
                switch (res.status) {
                    case ApiResult204NoContent.code:
                        return new ApiResult204NoContent();
                    case ApiResult200Ok.code:
                    case ApiResult201Created.code:
                        const retour = new ApiResult201Created(res.body);
                        return retour;
                    default:
                        break;
                }
            }
            ))
            .pipe(catchError(this.handleError.bind(this)));
    }

    public put<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this.http.put(this.config.route(controller, action), body, {
            headers: this.headers(),
            withCredentials: true,
            params,
            observe: 'response'
        })
            .pipe(tap(res => console.log('put', res)))
            .pipe(map(() => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError.bind(this)));
    }

    public delete(controller: string, action: string, params: { [param: string]: string }): Observable<ApiResult> {
        return this.http.delete(this.config.route(controller, action), {
            headers: this.headers(),
            withCredentials: true,
            params,
            observe: 'response'
        })
            .pipe(tap(res => console.log('delete', res)))
            .pipe(map(() => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError.bind(this)));
    }

    private _get<T>(observé: Observable<HttpResponse<T>>, debug: string): Observable<ApiResult> {
        return observé.pipe(
            tap(res => console.log('get ' + debug, res)),
            map(res => new ApiResult200Ok(res.body)),
            catchError(this.handleError.bind(this))
        );
    }

    /**
     * Pour les services qui envoie des requêtes Api sans key comme: motDePasseService
     */
    public getSansParamsSansIdentification<T>(controller: string, action: string): Observable<ApiResult> {
        const observé = this.http.get<T>(this.config.route(controller, action), {
            headers: this.headers(),
            observe: 'response'
        });
        return this._get<T>(observé, controller + '/' + action);
    }

    public get<T>(controller: string, action: string, params?: string | { [param: string]: string }): Observable<ApiResult> {
        const observé = !params
            ? this.http.get<T>(this.config.route(controller, action), {
                headers: this.headers(),
                withCredentials: true,
                observe: 'response'
            })
            : (typeof (params) === 'string')
                ? this.http.get<T>(this.config.route(controller, action, params), {
                    headers: this.headers(),
                    withCredentials: true,
                    observe: 'response'
                })
                : this.http.get<T>(this.config.route(controller, action), {
                    headers: this.headers(),
                    withCredentials: true,
                    params,
                    observe: 'response'
                });
        return this._get<T>(observé, controller + '/' + action);
    }

    public getAll<T>(controller: string, action: string, params?: { [param: string]: string }): Observable<ApiResult> {
        const observé = this.http.get<T[]>(this.config.route(controller, action), {
            headers: this.headers(),
            withCredentials: true,
            params,
            observe: 'response'
        });
        return this._get<T[]>(observé, controller + '/' + action);
    }

    // Action

    private résultatErreur(requêteDef: ApiRequêteAction, erreur: ApiResultErreur): IResultatAffichable {
        return {
            titre: requêteDef.titreErreur,
            typeAlert: 'danger',
            détails: erreur.messages
        };
    }

    private résultatConflict(requêteDef: ApiRequêteAction, apiResult: ApiResult409Conflict): ResultatAction {
        return ResultatAction.conflit(apiResult.erreur);
    }

    private résultatBadRequest(apiErreurs: ApiErreur400[], requêteDef: ApiRequêteAction): ResultatAction {
        let validateurs: KfValidateur[];
        let validateur: KfValidateur;
        let details: string[] = [];
        let traitées: ApiErreur400[];
        if (requêteDef.formulaire && apiErreurs) {
            if (requêteDef.formulaire.gereValeur) {
                const champs = requêteDef.formulaire.gereValeur.contenus;
                champs.forEach(c => {
                    validateurs = c.gereValeur.validateurs;
                    if (!validateurs) {
                        return;
                    }
                    traitées = [];
                    apiErreurs.filter(e => e.champ.toLowerCase() === c.nom.toLowerCase()).forEach(e => {
                        validateur = validateurs.find(v => v.nom.toLowerCase() === e.code.toLowerCase());
                        if (validateur && validateur.marqueErreur) {
                            validateur.marqueErreur(c.abstractControl);
                            traitées.push(e);
                            details.push(validateur.message);
                        }
                    });
                    apiErreurs = apiErreurs.filter(e => !traitées.find(t => t.champ === e.champ && t.code === e.code));
                });
                // erreurs du formulaire
                const erreursDuFormulaire = apiErreurs.filter(e => e.champ === '2');
                if (erreursDuFormulaire.length > 0) {
                    validateurs = requêteDef.formulaire.gereValeur.validateurs;
                    if (validateurs) {
                        validateur = validateurs.find(v => v.marqueErreur);
                        if (validateur) {
                            validateur.marqueErreur(requêteDef.formulaire.abstractControl);
                        }
                    }
                }
                details = details.concat(erreursDuFormulaire.map(e => e.code));
                apiErreurs = apiErreurs.filter(e => e.champ !== '2');
            }
            // erreurs qui ne devraient pas exister
            details = details.concat(apiErreurs.map(e => {
                return `Erreur: { champ: ${e.champ}, code: ${e.code}}`;
            }));
        }
        const resultat = ResultatAction.afficheErreur(requêteDef.titreErreur, details);
        return resultat;
    }

    /**
     * Exécute la requête et transforme l'ApiResult en ResultatAction
     */
    /*
    private résultat(requêteDef: ApiRequêteAction): Observable<ResultatAction> {
        return requêteDef.demandeApi().pipe(
            delay(0),
            map((result: ApiResult): ResultatAction => {
                if (!result) {
                    return null;
                }

                switch (result.statusCode) {
                    case 200:
                    case 204:
                        return this.résultatSuccès(requêteDef);
                    case 201:
                        const resultCrée = result as ApiResult201Created;
                        return this.résultatSuccès(requêteDef, resultCrée.entity);
                    case 409:
                        const resultConflit = result as ApiResult409Conflict;
                        return this.résultatConflict(requêteDef, resultConflit);
                    case 400:
                        const apiErreurs = (result as ApiResult400BadRequest).apiErreurs;
                        // les erreurs BadRequest sont stockées dans les ValidationErrors du formulaire
                        return this.résultatBadRequest(apiErreurs, requêteDef);
                    default:
                        return this.résultatAutresErreurs(result as ApiResultErreur, requêteDef);
                }
            })
        );
    }
    */

    public actionObs(requêteDef: ApiRequêteAction): Observable<boolean> {
        const attente = requêteDef.attente
            ? requêteDef.attente
            : this.attenteService.attente('action');
        attente.commence();

        if (requêteDef.afficheResultat) {
            requêteDef.afficheResultat.commence();
        }
        return requêteDef.demandeApi().pipe(
            delay(0),
            concatMap((result: ApiResult): Observable<boolean> => {
                attente.finit();
                if (!result) {
                    return null;
                }

                switch (result.statusCode) {
                    case ApiResult200Ok.code:
                    case ApiResult201Created.code:
                        if (requêteDef.afficheResultat) {
                            requêteDef.afficheResultat.affiche({
                                titre: requêteDef.titreSucces,
                                typeAlert: 'success'
                            });
                        }
                        if (requêteDef.actionSiOk) {
                            requêteDef.actionSiOk((result as ApiResult201Created).entity);
                        }
                        return of(true);
                    case ApiResult204NoContent.code:
                        if (requêteDef.afficheResultat) {
                            requêteDef.afficheResultat.affiche({
                                titre: requêteDef.titreSucces,
                                typeAlert: 'success'
                            });
                        }
                        if (requêteDef.actionSiOk) {
                            requêteDef.actionSiOk();
                        }
                        return of(true);
                    case ApiResult400BadRequest.code:
                        const result400 = (result as ApiResult400BadRequest);
                        const apiErreurs = result400.apiErreurs;
                        const résultat = this.résultatBadRequest(apiErreurs, requêteDef);
                        if (requêteDef.afficheResultat) {
                            requêteDef.afficheResultat.affiche(résultat);
                        } else {
                            result400.messages = résultat.détails;
                        }
                        return of(false);
                    case ApiResult401Unauthorized.code:
                        this.routeur.navigueVersPageErreur401(result as ApiResult401Unauthorized);
                        return of(false);
                    default:
                        if (requêteDef.traiteErreur && requêteDef.traiteErreur(result)) {
                            return of(false);
                        }
                        const apiErreur = result as ApiResultErreur;
                        if (requêteDef.afficheResultat) {
                            requêteDef.afficheResultat.affiche({
                                titre: requêteDef.titreErreur,
                                typeAlert: 'danger',
                                détails: apiErreur.messages
                            });
                            return of(false);
                        } else {
                            apiErreur.action = requêteDef.titreErreur;
                            return this.modalService.confirme(Fabrique.erreurModal(apiErreur));
                        }
                }
            })
        );
    }

    public lectureObs<T>(requêteDef: ApiRequêteLecture): Observable<T> {
        const attente = requêteDef.attente
            ? requêteDef.attente
            : this.attenteService.attente('lecture');

        attente.commence();
        return requêteDef.demandeApi().pipe(
            delay(0),
            map((result: ApiResult): T => {
                attente.finit();
                if (!result) {
                    return null;
                }

                switch (result.statusCode) {
                    case 200:
                        return (result as ApiResult200Ok<T>).lecture;
                    case ApiResult401Unauthorized.code:
                        this.routeur.navigueVersPageErreur401(result as ApiResult401Unauthorized);
                        break;
                    default:
                        if (result.ok) {
                            console.error(`lecturObs a un retour sans erreur autre que 200.`);
                        } else {
                            if (requêteDef.traiteErreur && requêteDef.traiteErreur(result)) {
                                return null;
                            }
                            this.routeur.navigueVersPageErreur(result as ApiResultErreur);
                        }
                        return null;
                }
            })
        );
    }

}
