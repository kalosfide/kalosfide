import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { CODE_EXEMPLE } from 'src/app/modeles/code-exemple';
import { CompteService } from '../../compte/compte.service';
import { InvitationClient } from './devenir-client-data';


@Injectable()
export class DevenirClientResolverService implements Resolve<InvitationClient> {

    constructor(
        private service: CompteService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | InvitationClient | Observable<InvitationClient> {
        const code = route.queryParamMap.get('code');
        if (!code) {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return EMPTY;
        }
        if (code === CODE_EXEMPLE) {
            const data = new InvitationClient();
            data.titre = 'Nom du site'
            return data;
        }
        return this.service.invitationClient(code).pipe(
            tap(() => this.service.identification.déconnecte()),
            map((data: InvitationClient) => {
                data.code = code;
                return data;
            })
        );
    }

}
