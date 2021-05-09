import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FournisseurPages } from './fournisseur-pages';
import { FAccueilComponent } from './f-accueil.component';
import { AppPages } from '../app-pages';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { LivraisonPages } from './livraisons/livraison-pages';
import { FacturePages } from './factures/facture-pages';
import { FDocumentPages } from './documents/f-document-pages';
import { ModalErreurComponent } from '../erreurs/modal-erreur.component';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { FournisseurClientPages } from './clients/client-pages';

const routes: Routes = [
    {
        path: '',
        redirectTo: FournisseurPages.accueil.urlSegment,
        pathMatch: 'full',
    },
    {
        path: FournisseurPages.accueil.urlSegment,
        component: FAccueilComponent,
    },
    {
        path: FournisseurPages.livraison.urlSegment,
        data: {
            pageDef: FournisseurPages.livraison,
            pageDefDescendantParDéfaut: LivraisonPages.choixClient
        },
        loadChildren: () => import('./livraisons/livraison.module').then(mod => mod.LivraisonModule)
    },
    {
        path: FournisseurPages.facture.urlSegment,
        data: {
            pageDef: FournisseurPages.facture,
            pageDefDescendantParDéfaut: FacturePages.choixClient
        },
        loadChildren: () => import('./factures/facture.module').then(mod => mod.FactureModule)
    },
    {
        path: FournisseurPages.documents.urlSegment,
        data: {
            pageDef: FournisseurPages.documents,
            pageDefDescendantParDéfaut: FDocumentPages.liste,
        },
        loadChildren: () => import('./documents/f-document.module').then(mod => mod.FDocumentModule),
    },
    {
        path: FournisseurPages.site.urlSegment,
        data: {
            pageDef: FournisseurPages.site,
            pageDefDescendantParDéfaut: FournisseurPages.catalogue,
        },
        children: [
            {
                path: '',
                redirectTo: FournisseurPages.catalogue.urlSegment,
                pathMatch: 'full',
            },
            {
                path: FournisseurPages.site.urlSegment,
                data: {
                    pageDef: FournisseurPages.site,
                },
                loadChildren: () => import('./f-site/f-site.module').then(mod => mod.FSiteModule),
            },
            {
                path: FournisseurPages.catalogue.urlSegment,
                data: {
                    pageDef: FournisseurPages.catalogue,
                },
                loadChildren: () => import('./catalogue/catalogue.module').then(mod => mod.CatalogueModule)
            },
            {
                path: FournisseurPages.clients.urlSegment,
                data: {
                    pageDef: FournisseurPages.clients,
                    pageDefDescendantParDéfaut: FournisseurClientPages.accueil,
                },
                loadChildren: () => import('./clients/client.module').then(mod => mod.ClientModule)
            },
        ],
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
export class FournisseurRoutingModule { }
