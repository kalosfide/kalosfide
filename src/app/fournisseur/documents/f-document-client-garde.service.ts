import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { NomParam } from 'src/app/modeles/nom-param';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';

/**
 * Résoud la liste des documents d'un client en la demandant à l'api.
 * Redirige vers la page NotFound si le client n'existe pas, vers la page clients si le client n'a pas de documents.
 */
@Injectable()
export class FDocumentClientGardeService implements CanActivate {

    constructor(
        protected service: FournisseurCLFService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const paramKey = route.paramMap.get(NomParam.keyClient);
        if (paramKey) {
            const key = KeyUidRno.keyDeTexte(paramKey);
            return this.service.clientAvecRésumésDocs(key).pipe(
                map(clfDocs => {
                    if (!clfDocs.apiDocs || clfDocs.apiDocs.length === 0) {
                        this.service.routeur.navigueUrlDef(this.service.utile.url.clientsBilansDocs());
                        return this.service.routeur.urlTreeErreur(new ApiResult404NotFound());
                    }
                    return true;
                })
                
            );
        } else {
            return this.service.routeur.urlTreeErreur(new ApiResult404NotFound());
        }
    }
}
