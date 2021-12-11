import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TypeCLF } from '../modeles/c-l-f/c-l-f-type';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { FournisseurCLFService } from 'src/app/fournisseur/fournisseur-c-l-f-.service';
import { NomParam } from '../modeles/nom-param';
import { CLFLitTypeDansRoute } from '../modeles/c-l-f/c-l-f-resolver/c-l-f-lit-type-dans-route';

@Injectable()
/**
 * Bloque la route tant que le stock n'est pas chargé.
 * La route doit avoir un data avec un champ typeCLF.
 * Fixe le stock avec les bons à synthétiser du client.
 */
export class LFAttenteBonsGardeService extends CLFLitTypeDansRoute implements CanActivate {

    constructor(protected service: FournisseurCLFService) {
        super();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const type: TypeCLF = this.litType(route, state);
        const paramKey = route.paramMap.get(NomParam.keyClient);
        if (paramKey) {
            const key = KeyUidRno.keyDeTexte(paramKey);
            return this.service.clientAvecBons(key, type).pipe(
                map(() => {
                    return true;
                }),
                catchError(err => {
                    console.error(err);
                    return EMPTY;
                })
            );
        } else {
            return this.service.routeur.urlTreeErreur(new ApiResult404NotFound());
        }
    }

}
