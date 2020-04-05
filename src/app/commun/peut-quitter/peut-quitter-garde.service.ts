import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ComptePages } from 'src/app/compte/compte-pages';
import { RouteurService } from 'src/app/services/routeur.service';
import { AppPages } from 'src/app/app-pages';

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
        return (nextState && nextState.url === this.routeur.urlDansSite([AppPages.compte.urlSegment, ComptePages.deconnection.urlSegment]))
            || (component.peutQuitter ? component.peutQuitter(nextState) : true);
    }
}
