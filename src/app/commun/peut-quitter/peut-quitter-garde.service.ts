import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ComptePages } from 'src/app/compte/compte-pages';
import { RouteurService } from 'src/app/services/routeur.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export interface ComponentAAutoriserAQuitter {
    peutQuitter: (nextState?: RouterStateSnapshot) => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class PeutQuitterGarde implements CanDeactivate<ComponentAAutoriserAQuitter> {

    constructor(private routeur: RouteurService) {}

    canDeactivate(
        component: ComponentAAutoriserAQuitter,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        return (nextState && nextState.url === Fabrique.url.appRouteur.compte.url(ComptePages.deconnection.path))
            || (component.peutQuitter ? component.peutQuitter(nextState) : true);
    }
}
