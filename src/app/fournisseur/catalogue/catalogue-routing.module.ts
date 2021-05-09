import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogueResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';
import { CatalogueComponent } from './catalogue.component';
import { FournisseurPages } from '../fournisseur-pages';
import { CataloguePages } from './catalogue-pages';
import { CatalogueFinitService } from './catalogue-finit.service';
import { CatalogueCommenceService } from './catalogue-commence.service';

const routes: Routes = [
    {
        path: '',
        component: CatalogueComponent,
        data: {
            pageDef: FournisseurPages.catalogue,
        },
        resolve: {
            catalogue: CatalogueResolverService,
        },
        canDeactivate: [CatalogueFinitService],
        children: [
            {
                path: '',
                redirectTo: CataloguePages.produits.urlSegment,
                pathMatch: 'full'
            },
            {
                path: CataloguePages.produits.urlSegment,
                data: {
                    pageDef: CataloguePages.produits,
                    estEnfantPathVide: true
                },
                loadChildren: () => import('./produits/produit.module').then(mod => mod.ProduitModule)
            },
            {
                path: CataloguePages.categories.urlSegment,
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
