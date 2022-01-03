import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriePages } from './categorie-pages';
import { CategorieIndexComponent } from './categorie-index.component';
import { CategorieAjouteComponent } from './categorie-ajoute.component';
import { CategorieEditeComponent } from './categorie-edite.component';
import { CategorieResolverService } from '../../../modeles/catalogue/categorie-resolver.service';
import { CategorieSitePasCatalogueGarde } from './categorie-site-pas-catalogue-garde';
import { CatalogueResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: CategoriePages.index.path,
                pathMatch: 'full',
            },
            {
                path: CategoriePages.index.path,
                data: {
                    pageDef: undefined,
                },
                component: CategorieIndexComponent,
                resolve: {
                    catalogue: CatalogueResolverService,
                }
            },
            {
                path: CategoriePages.ajoute.path,
                data: { pageDef: CategoriePages.ajoute },
                component: CategorieAjouteComponent,
                canActivate: [
                    CategorieSitePasCatalogueGarde,
                ],
            },
            {
                path: CategoriePages.edite.path + '/:id',
                data: { pageDef: CategoriePages.edite },
                component: CategorieEditeComponent,
                canActivate: [
                    CategorieSitePasCatalogueGarde,
                ],
                resolve: {
                    valeur: CategorieResolverService,
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategorieRoutingModule { }
