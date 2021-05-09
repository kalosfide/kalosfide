import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientPages } from './client-pages';
import { CAccueilComponent } from './c-accueil.component';
import { AppPages } from '../app-pages';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { EtatSiteChangeGarde } from '../securite/site-ouvert-garde';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { ModalErreurComponent } from '../erreurs/modal-erreur.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: ClientPages.accueil.urlSegment,
        pathMatch: 'full',
    },
    {
        path: ClientPages.accueil.urlSegment,
        data: { pageDef: undefined },
        component: CAccueilComponent,
        canActivate: [
            EtatSiteChangeGarde,
        ]
    },
    {
        path: ClientPages.produits.urlSegment,
        data: { pageDef: ClientPages.produits },
        loadChildren: () => import('src/app/modeles/catalogue/vccatalogue.module').then(mod => mod.VCCatalogueModule),
    },
    {
        path: ClientPages.commandes.urlSegment,
        data: { pageDef: ClientPages.commandes },
        loadChildren: () => import('./commandes/commande.module').then(mod => mod.CommandeModule),
    },
    {
        path: ClientPages.documents.urlSegment,
        data: { pageDef: ClientPages.documents },
        loadChildren: () => import('./documents/c-document.module').then(mod => mod.CDocumentModule),
    },
    {
        path: AppPages.compte.urlSegment,
        loadChildren: () => import('../compte/compte.module').then(mod => mod.CompteModule)
    },
    // pages d'erreur
    {
        path: AppPages.apiErreur.urlSegment,
        data: { pageDef: AppPages.apiErreur },
        component: PageErreurComponent,
        resolve: {
            apiErreur: ApiErreurResolverService
        }
    },
    {
        path: AppPages.apiErreurModal.urlSegment,
        component: ModalErreurComponent,
    },
    {
        path: '**',
        redirectTo: AppPages.apiErreur.urlSegment,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
