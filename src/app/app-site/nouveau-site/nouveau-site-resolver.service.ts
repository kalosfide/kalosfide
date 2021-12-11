import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CODE_EXEMPLE } from 'src/app/modeles/code-exemple';
import { CompteService } from '../../compte/compte.service';
import { NouveauSite } from './nouveau-site';


@Injectable()
export class NouveauSiteResolverService implements Resolve<NouveauSite> {

    constructor(
        private service: CompteService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | NouveauSite | Observable<NouveauSite> {
        const code = route.queryParamMap.get('code');
        if (!code) {
            return null;
        }
        if (code === CODE_EXEMPLE) {
            const data = new NouveauSite();
            data.titre = 'Nom du site'
            return data;
        }
        return this.service.litNouveauSite(code).pipe(
            tap(() => this.service.identification.déconnecte()),
            map((data: NouveauSite) => {
                data.code = code;
                return data;
            })
        );
    }

}
