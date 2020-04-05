import { CLFService } from '../c-l-f.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TypeCLF } from '../c-l-f-type';
import { CLFPages } from '../c-l-f-pages';
import { ApiResult404NotFound } from 'src/app/commun/api-results/api-result-404-not-found';
import { Observable, EMPTY } from 'rxjs';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { map, catchError } from 'rxjs/operators';

export class CLFAttenteBonsGardeService {
    type: TypeCLF;

    attente: number;

    constructor(protected service: CLFService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const paramKey = route.paramMap.get(CLFPages.nomParamKeyClient);
        if (paramKey) {
            if (this.attente === undefined) {
                this.attente = this.service.attenteService.commence();
            }
            const key = KeyUidRno.keyDeTexte(paramKey);
            return this.service.clientAvecBons(key, this.type).pipe(
                map(clfDocs => {
                    console.log('clfDocs', clfDocs);
                    if (this.attente !== undefined) {
                        this.service.attenteService.finit(this.attente);
                        this.attente = undefined;
                    }
                    return true;
                }),
                catchError(err => {
                    console.log(err);
                    return EMPTY;
                })
            );
        } else {
            this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
            return false;
        }
    }

}
