import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { ClientCLFService } from '../client-c-l-f.service';
import { CommandePages } from './commande-pages';
import { Observable } from 'rxjs';

@Injectable()
export class CommandeProduitResolverService implements Resolve<Produit> {
    pageDefErreur = CommandePages.lignes;

    constructor(
        private service: ClientCLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Produit | Observable<Produit> {
        const noString: string = route.paramMap.get('no');
        return this.service.résoudProduit(noString);
    }

}
