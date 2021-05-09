import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { RouteurService } from '../services/routeur.service';
import { PeupleService } from './peuple.service';

@Injectable()
export class PeupleResolverService extends DataResolverService implements Resolve<boolean> {

    constructor(
        private routeur: RouteurService,
        private service: PeupleService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<boolean> {
        const demandeApi = () => this.service.estPeuplé();
        return this.service.lectureObs<boolean>({ demandeApi });
    }

}
