import { Injectable } from '@angular/core';
import { CanActivateChild, CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientCLFService } from '../client-c-l-f.service';

@Injectable()
/**
 * Redirige vers la page Contexte si le site est d'état Catalogue ou si le catalogue est périmé.
 */
export class RedirigeSiContexteChangé implements CanActivate, CanActivateChild {

    constructor(
        private service: ClientCLFService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.service.gardePageBon();
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        console.log(state.url);
        return this.canActivate(route, state);
    }
}

@Injectable()
/**
 * Redirige vers la page Bon si le site est ouvert et le catalogue est à jour.
 */
export class RedirigeSiPasContexte implements CanActivate {

    constructor(
        private service: ClientCLFService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const gardé = this.service.gardeContexte();
        if (!gardé) {
            this.service.routeur.navigueUrlDef(this.service.utile.url.bon());
        }
        return gardé;
    }
}
