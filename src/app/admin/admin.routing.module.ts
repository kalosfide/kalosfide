import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPages } from '../app-pages';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { AdminAccueilComponent } from './admin-accueil.component';
import { AdminPages } from './admin-pages';
import { AdminComponent } from './admin.component';
import { FournisseursIndexComponent } from './fournisseurs/fournisseurs-index.component';
import { FournisseursPages } from './fournisseurs/fournisseurs-pages';
import { FournisseursResolverService } from './fournisseurs/fournisseurs-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: AdminPages.accueil.path,
                pathMatch: 'full',
            },
            {
                path: AdminPages.accueil.path,
                component: AdminAccueilComponent,
                data: {
                    pageDef: AdminPages.accueil,
                    estEnfantPathVide: true
                },
            },
            {
                path: AdminPages.fournisseurs.path,
                children: [
                    {
                        path: '',
                        redirectTo: FournisseursPages.index.path,
                        pathMatch: 'full',
                    },
                    {
                        path: FournisseursPages.index.path,
                        component: FournisseursIndexComponent,
                        data: {
                            pageDef: FournisseursPages.index,
                            estEnfantPathVide: true
                        },
                        resolve: {
                            liste: FournisseursResolverService,
                        }
                    }
                ]
            },
            {
                path: AppPages.apiErreur.path,
                data: { pageDef: AppPages.apiErreur },
                component: PageErreurComponent,
                resolve: {
                    apiErreur: ApiErreurResolverService
                }
            },
            {
                path: '**',
                redirectTo: AppPages.apiErreur.path,
            },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
