import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { CLFLigne } from '../c-l-f-ligne';
import { CLFService } from '../c-l-f.service';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { NomParam } from '../../nom-param';

@Injectable()
export class CLFLigneResolverService implements Resolve<CLFLigne> {

    constructor(
        protected service: CLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | CLFLigne | Observable<CLFLigne> {
        const no = +route.paramMap.get(NomParam.noDoc);
        const no2 = +route.paramMap.get(NomParam.noLigne);
        let clfLigne: CLFLigne;
        const clfDoc = this.service.litStock().créeBon(no);
        if (clfDoc && clfDoc.apiLignes) {
            clfLigne = clfDoc.créeLigne(no2);
        }
        if (!clfLigne) {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return EMPTY;
        }
        return of(clfLigne);
    }
}
