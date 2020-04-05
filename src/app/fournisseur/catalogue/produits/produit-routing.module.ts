import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProduitIndexComponent } from './produit-index.component';
import { ProduitAjouteComponent } from './produit-ajoute.component';
import { ProduitEditeComponent } from './produit-edite.component';
import { ProduitResolverService } from '../../../modeles/catalogue/produit-resolver.service';
import { CategoriesResolverService } from 'src/app/modeles/catalogue/categories-resolver.service';
import { ProduitPages } from './produit-pages';
import { CatalogueResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';
import { ProduitSitePasCatalogueGarde } from './produit-site-pas-catalogue-garde';
import { CatalogueComponent } from '../catalogue.component';
import { ProduitSupprimeComponent } from './produit-supprime.component';
import { FournisseurPages } from '../../fournisseur-pages';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: ProduitPages.index.urlSegment,
                pathMatch: 'full'
            },
            {
                path: ProduitPages.index.urlSegment,
                data: {
                    pageDef: undefined
                },
                component: ProduitIndexComponent,
                resolve: {
                    catalogue: CatalogueResolverService,
                }
            },
            {
                path: ProduitPages.ajoute.urlSegment,
                data: {
                    pageDef: ProduitPages.ajoute,
                    estEnfantPathVide: undefined
                },
                        component: ProduitAjouteComponent,
                canActivate: [
                    ProduitSitePasCatalogueGarde,
                ],
                resolve: {
                    categories: CategoriesResolverService,
                }
            },
            {
                path: ProduitPages.edite.urlSegment + '/:no',
                data: {
                    pageDef: ProduitPages.edite,
                    estEnfantPathVide: undefined
                },
                component: ProduitEditeComponent,
                canActivate: [
                    ProduitSitePasCatalogueGarde,
                ],
                resolve: {
                    valeur: ProduitResolverService,
                    categories: CategoriesResolverService,
                }
            },
            {
                path: ProduitPages.supprime.urlSegment + '/:no',
                data: { pageDef: ProduitPages.supprime },
                component: ProduitSupprimeComponent,
                canActivate: [
                    ProduitSitePasCatalogueGarde,
                ],
                resolve: {
                    valeur: ProduitResolverService,
                    categories: CategoriesResolverService,
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProduitRoutingModule { }
