import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FournisseurPages } from './fournisseur-pages';
import { FAccueilComponent } from './f-accueil.component';
import { AppPages } from '../app-pages';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';
import { LivraisonPages } from './livraisons/livraison-pages';
import { FacturePages } from './factures/facture-pages';
import { FDocumentPages } from './documents/f-document-pages';

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
        path: FournisseurPages.catalogue.urlSegment,
        data: {
            pageDef: FournisseurPages.catalogue,
        },
        loadChildren: () => import('./catalogue/catalogue.module').then(mod => mod.CatalogueModule)
    },
    {
        path: FournisseurPages.clients.urlSegment,
        loadChildren: () => import('./clients/client.module').then(mod => mod.ClientModule)
    },
    {
        path: FournisseurPages.livraison.urlSegment,
        data: {
            pageDef: FournisseurPages.livraison,
            pageDefEnfantPathVide: LivraisonPages.choixClient
        },
        loadChildren: () => import('./livraisons/livraison.module').then(mod => mod.LivraisonModule)
    },
    {
        path: FournisseurPages.facture.urlSegment,
        data: {
            pageDef: FournisseurPages.facture,
            pageDefEnfantPathVide: FacturePages.choixClient
        },
        loadChildren: () => import('./factures/facture.module').then(mod => mod.FactureModule)
    },
    {
        path: FournisseurPages.documents.urlSegment,
        data: {
            pageDef: FournisseurPages.documents,
            pageDefEnfantPathVide: FDocumentPages.liste,
        },
        loadChildren: () => import('./documents/f-document.module').then(mod => mod.FDocumentModule),
    },
    {
        path: FournisseurPages.site.urlSegment,
        data: {
            pageDef: FournisseurPages.site,
        },
        loadChildren: () => import('./f-site/f-site.module').then(mod => mod.FSiteModule),
    },
    {
        path: AppPages.compte.urlSegment,
        loadChildren: () => import('../compte/compte.module').then(mod => mod.CompteModule)
    },
    // pages d'erreur
    {
        path: AppPages.interdit.urlSegment,
        component: PageInterditeComponent
    },
    {
        path: AppPages.conflit.urlSegment,
        component: PageConflitComponent
    },
    {
        path: AppPages.apiErreur.urlSegment,
        component: PageErreurComponent,
    },
    {
        path: AppPages.introuvable.urlSegment,
        component: PageIntrouvableComponent,
    },
    {
        path: '**',
        redirectTo: AppPages.introuvable.urlSegment,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FournisseurRoutingModule { }
