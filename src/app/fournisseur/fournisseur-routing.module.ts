import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FournisseurPages } from './fournisseur-pages';
import { FAccueilComponent } from './f-accueil.component';
import { AppPages } from '../app-pages';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { LivraisonPages } from './livraisons/livraison-pages';
import { FacturePages } from './factures/facture-pages';
import { FDocumentPages } from './documents/f-document-pages';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { FournisseurClientPages } from './clients/client-pages';
import { AppSitePages } from '../app-site/app-site-pages';
import { SiteOuvertGardeService } from '../site/site-ouvert-garde.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: FournisseurPages.accueil.path,
        pathMatch: 'full',
    },
    {
        path: FournisseurPages.accueil.path,
        component: FAccueilComponent,
    },
    {
        path: FournisseurPages.livraison.path,
        data: {
            pageDef: FournisseurPages.livraison,
            pageDefDescendantParDéfaut: LivraisonPages.choixClient
        },
        canActivate: [
            SiteOuvertGardeService
        ],
        loadChildren: () => import('./livraisons/livraison.module').then(mod => mod.LivraisonModule)
    },
    {
        path: FournisseurPages.facture.path,
        data: {
            pageDef: FournisseurPages.facture,
            pageDefDescendantParDéfaut: FacturePages.choixClient
        },
        canActivate: [
            SiteOuvertGardeService
        ],
        loadChildren: () => import('./factures/facture.module').then(mod => mod.FactureModule)
    },
    {
        path: FournisseurPages.documents.path,
        data: {
            pageDef: FournisseurPages.documents,
            pageDefDescendantParDéfaut: FDocumentPages.liste,
        },
        loadChildren: () => import('./documents/f-document.module').then(mod => mod.FDocumentModule),
    },
    {
        path: FournisseurPages.gestion.path,
        data: {
            pageDef: FournisseurPages.gestion,
            pageDefDescendantParDéfaut: FournisseurPages.catalogue,
        },
        children: [
            {
                path: '',
                redirectTo: FournisseurPages.catalogue.path,
                pathMatch: 'full',
            },
            {
                path: FournisseurPages.catalogue.path,
                data: {
                    pageDef: FournisseurPages.catalogue,
                },
                loadChildren: () => import('./catalogue/catalogue.module').then(mod => mod.CatalogueModule)
            },
            {
                path: FournisseurPages.site.path,
                data: {
                    pageDef: FournisseurPages.site,
                },
                loadChildren: () => import('./f-site/f-site.module').then(mod => mod.FSiteModule),
            },
            {
                path: FournisseurPages.clients.path,
                data: {
                    pageDef: FournisseurPages.clients,
                    pageDefDescendantParDéfaut: FournisseurClientPages.accueil,
                },
                loadChildren: () => import('./clients/client.module').then(mod => mod.ClientModule)
            },
        ],
    },
    {
        path: AppSitePages.compte.path,
        loadChildren: () => import('../compte/compte.module').then(mod => mod.CompteModule)
    },
    // pages d'erreur
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FournisseurRoutingModule { }
