import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeCLF } from '../modeles/c-l-f/c-l-f-type';
import { CLFLitTypeDansRoute } from '../modeles/c-l-f/c-l-f-resolver/c-l-f-lit-type-dans-route';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';

@Injectable()
/**
 * Redirige vers la page ./bons si la synthèse n'est pas prête.
 * La route doit avoir un data avec un champ typeCLF.
 */
export class LFEnvoiGardeService extends CLFLitTypeDansRoute implements CanActivate {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | boolean | UrlTree {
        const type: TypeCLF = this.litType(route, state);
        const clfDocs = this.service.litStockSiExistant();
        if (!clfDocs) {
            throw new Error(`LFEnvoiGardeService: Pas de clfDocs en stock (${state.url})`);
        }
        clfDocs.créeBilan();
        if (clfDocs.clfBilan.sélectionnés === 0) {
            this.service.utile.url.fixeRouteBase(type);
            return this.service.routeur.urlTreeUrlDef(this.service.utile.url.bons(clfDocs.client));
        }
        return true;
    }
}
