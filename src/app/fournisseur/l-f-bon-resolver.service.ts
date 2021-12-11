import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { NomParam } from '../modeles/nom-param';
import { Injectable } from '@angular/core';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';

@Injectable()
export class LFBonResolverService implements Resolve<CLFDoc> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | CLFDoc | Observable<CLFDoc> {
        const no = +route.paramMap.get(NomParam.noDoc);
        const clfDocs = this.service.litStockSiExistant();
        if (!clfDocs) {
            throw new Error(`LFBonResolverService: Pas de clfDocs en stock (${state.url})`);
        }
        const clfDoc = clfDocs.créeBon(no);
        if (!clfDoc) {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return EMPTY;
        }
        return of(clfDoc);
    }
}
