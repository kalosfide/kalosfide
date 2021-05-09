import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Produit } from './produit';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { Catalogue } from './catalogue';

@Injectable()
export class ProduitResolverService extends DataResolverService implements Resolve<Produit> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Produit | Observable<Produit> {
        const catalogue: Catalogue = this.résolu(route, 'catalogue');
        if (!catalogue) {
            throw new Error('ProduitResolverService: CatalogueResolverService doit avoir déjà résolu le catalogue');
        }
        const no: number = +route.paramMap.get('no');
        const produit: Produit = catalogue.produits.find(p => p.no === no);
        produit.nomCategorie = catalogue.catégories.find(c => produit.categorieNo === c.no).nom;
        return produit;
    }

}
