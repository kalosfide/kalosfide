import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogueResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';
import { CatalogueComponent } from './catalogue.component';
import { FournisseurPages } from '../fournisseur-pages';
import { CataloguePages } from './catalogue-pages';
import { CatalogueFinitService } from './catalogue-finit.service';
import { ProduitSitePasCatalogueGarde } from './produits/produit-site-pas-catalogue-garde';

const routes: Routes = [
    {
        path: '',
        component: CatalogueComponent,
        data: {
            pageDef: FournisseurPages.catalogue,
        },
        resolve: {
            // Charge ou lit le catalogue
            catalogue: CatalogueResolverService,
        },
        canDeactivate: [
            // Termine la modification si le catalogue n'est pas vide
            CatalogueFinitService
        ],
        children: [
            {
                path: '',
                redirectTo: CataloguePages.produits.path,
                pathMatch: 'full'
            },
            {
                path: CataloguePages.produits.path,
                data: {
                    pageDef: CataloguePages.produits,
                    estEnfantPathVide: true
                },
                loadChildren: () => import('./produits/produit.module').then(mod => mod.ProduitModule)
            },
            {
                path: CataloguePages.categories.path,
                canActivate: [
                    ProduitSitePasCatalogueGarde,
                ],
                data: {
                    pageDef: CataloguePages.categories,
                },
                loadChildren: () => import('./categories/categorie.module').then(mod => mod.CategorieModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogueRoutingModule { }
