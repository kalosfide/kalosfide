import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { CLFResolverService } from './c-l-f-resolver.service';
import { CLFLigne } from '../c-l-f-ligne';
import { TypeCLF } from '../c-l-f-type';
import { CLFService } from '../c-l-f.service';
import { CLFPages } from '../c-l-f-pages';
import { switchMap } from 'rxjs/operators';
import { ApiResult404NotFound } from 'src/app/commun/api-results/api-result-404-not-found';

@Injectable()
export class CLFLigneResolverService extends CLFResolverService implements Resolve<CLFLigne> {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | CLFLigne | Observable<CLFLigne> {
        const no = +route.paramMap.get(CLFPages.nomParamNoDoc);
        const no2 = +route.paramMap.get(CLFPages.nomParamNoLigne);
        return this.service.bons().pipe(
            switchMap(clfDocs => {
                const clfDoc = clfDocs.créeBon(no);
                if (!clfDoc) {
                    this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
                    return EMPTY;
                }
                if (!clfDoc.apiLignesData) {
                    this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
                    return EMPTY;
                }
                const clfLigne = clfDoc.créeLigne(no2);
                if (!clfLigne) {
                    this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
                    return EMPTY;
                }
                return of(clfLigne);
            })
        );
    }
}
