import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Produit } from './produit';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { Catalogue } from './catalogue';
import { ProduitService } from './produit.service';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';

@Injectable()
export class ProduitResolverService extends DataResolverService implements Resolve<Produit> {

    constructor(private service: ProduitService) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Produit | Observable<Produit> {
        const catalogue: Catalogue = this.résolu(route, 'catalogue');
        if (!catalogue) {
            throw new Error('ProduitResolverService: CatalogueResolverService doit avoir déjà résolu le catalogue');
        }
        const no: number = +route.paramMap.get('no');
        const produit: Produit = catalogue.produits.find(p => p.no === no);
        if (!produit) {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return EMPTY;
        }
        return produit;
    }

}
