import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FournisseurCLFService } from 'src/app/fournisseur/fournisseur-c-l-f-.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFLitTypeDansRoute } from '../modeles/c-l-f/c-l-f-resolver/c-l-f-lit-type-dans-route';
import { TypeCLF } from '../modeles/c-l-f/c-l-f-type';

@Injectable()
/**
 * Résoud un CLFDocs qui contient les Client de tous les clients et en apiDocs, la liste des résumés des bons envoyés et sans synthèse de tous les clients.
 * Pas stocké.
 * La route doit avoir un data avec un champ typeCLF.
 */
export class LFClientsResolverService extends CLFLitTypeDansRoute implements Resolve<CLFDocs> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFDocs> {
        const type: TypeCLF = this.litType(route, state); 
        return this.service.clientsAvecRésumésBons(type);
    }
}
