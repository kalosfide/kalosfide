import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap, tap } from 'rxjs/operators';
import { IdentificationService } from '../securite/identification.service';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { RouteurService } from './routeur.service';
import { ApiRequêteService } from './api-requete.service';
import { ApiRequêteAction } from './api-requete-action';
import { NavigationService } from './navigation.service';
import { AttenteService } from './attente.service';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { KfNgbModalService } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiResult423Locked } from '../commun/api-results/api-result-423-locked-content';
import { ApiResult409Conflict } from '../commun/api-results/api-result-409-conflict';

export abstract class DataService {

    abstract controllerUrl: string;

    constructor(
        protected apiRequeteService: ApiRequêteService
    ) {
    }

    get identification(): IdentificationService { return this.apiRequeteService.identification; }
    get routeur(): RouteurService { return this.apiRequeteService.routeur; }
    get navigation(): NavigationService { return this.apiRequeteService.navigation; }
    get attenteService(): AttenteService { return this.apiRequeteService.attenteService; }
    get modalService(): KfNgbModalService { return this.apiRequeteService.modalService; }

    public get keyIdentifiant(): IKeyUidRno {
        const identifiant = this.identification.litIdentifiant();
        if (identifiant) {
            const nomSite = this.navigation.litSiteEnCours().nomSite;
            return {
                uid: identifiant.uid,
                rno: identifiant.roles.find(r => r.nomSite === nomSite).rno
            };
        }
    }

    public get keySiteEnCours(): IKeyUidRno {
        const site = this.navigation.litSiteEnCours();
        const keySite = {
            uid: site.uid,
            rno: site.rno
        };
        return keySite;
    }

    protected post<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.post<T>(controller, action, data, params);
    }

    protected put<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.put<T>(controller, action, data, params);
    }

    protected delete(controller: string, action: string, params: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.delete(controller, action, params);
    }

    protected getSansParamsSansIdentification(controller: string, action: string): Observable<ApiResult> {
        return this.apiRequeteService.getSansParamsSansIdentification(controller, action);
    }

    protected get<T>(controller: string, action: string, params: string | { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.get<T>(controller, action, params);
    }

    protected getAll<T>(controller: string, action: string, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.getAll<T>(controller, action, params);
    }

    public objet<T>(apiResult$: Observable<ApiResult>, traiteErreur?: (apiResult: ApiResult) => boolean): Observable<T> {
        return apiResult$.pipe(
            take(1),
            mergeMap(apiResult => {
                switch (apiResult.statusCode) {
                    case ApiResult200Ok.code:
                        const objet = (apiResult as ApiResult200Ok<T>).lecture;
                        return of(objet);
                    default:
                        if (!traiteErreur || !traiteErreur(apiResult)) {
                            this.routeur.navigueVersErreur(apiResult);
                        }
                        return EMPTY;
                }
            })
        );
    }

    public action(requêteActionDef: ApiRequêteAction) {
        this.apiRequeteService.action(requêteActionDef);
    }

    public actionOkObs(requêteActionDef: ApiRequêteAction): Observable<boolean> {
        return this.apiRequeteService.actionOkObs(requêteActionDef);
    }

    avecAttente<T>(resolve: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<T>):
        (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<T> {
        return ((route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            const attente = this.attenteService.commence();
            return resolve(route, state).pipe(
                tap(() => this.attenteService.finit(attente))
            );
        }).bind(this);
    }

}
