import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompteService } from '../../compte/compte.service';
import { DevenirClientData } from './devenir-client-data';


@Injectable()
export class DevenirClientResolverService implements Resolve<DevenirClientData> {

    constructor(
        private service: CompteService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<DevenirClientData> {
        const code = route.queryParamMap.get('code');
        if (!code) {
            return EMPTY;
        }
        return this.service.invitationClient(code).pipe(
            map((data: DevenirClientData) => {
                data.code = code;
                return data;
            })
        );
    }

}
