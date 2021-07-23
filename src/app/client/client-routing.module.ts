import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientPages } from './client-pages';
import { CAccueilComponent } from './c-accueil.component';
import { AppPages } from '../app-pages';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { ModalErreurComponent } from '../erreurs/modal-erreur.component';
import { CProduitsComponent } from './c-produits.component';
import { SiteOuvertGardeService } from './site-ouvert-garde.service';
import { CatalogueResolverService } from '../modeles/catalogue/catalogue-resolver.service';
import { SitePasOuvertComponent } from './site-pas-ouvert.component';
import { SitePasOuvertGardeService } from './site-pas-ouvert-garde.service';
import { ContexteCatalogueResolverService } from './contexte-catalogue-resolver.service';
import { LitEtatSiteEtLaissePasserGardeService } from './lit-etat-site-et-laisse-passer-garde.service';

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
            // Lit l'état du site dans la bdd et si changé, met à jour les stockages du site
            // et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
            // et si le site a réouvert, affiche une fenêtre modale  d'information.
            // Laisse passer.
            LitEtatSiteEtLaissePasserGardeService
        ]
    },
    {
        path: ClientPages.catalogue.urlSegment,
        data: { pageDef: ClientPages.catalogue },
        component: CProduitsComponent,
        canActivate: [
            // Lit l'état du site dans la bdd et si changé, met à jour les stockages du site
            // et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
            // et si le site a réouvert, affiche une fenêtre modale  d'information.
            // Laisse passer.
            LitEtatSiteEtLaissePasserGardeService,
            // Si le site de NavigationService est ouvert, laisse passer, sinon redirige vers pasOuvert
            SiteOuvertGardeService,
        ],
        resolve: {
            catalogue: CatalogueResolverService,
        },
    },
    {
        path: ClientPages.pasOuvert.urlSegment,
        data: { pageDef: ClientPages.pasOuvert },
        component: SitePasOuvertComponent,
        canActivate: [
            // Si le site de NavigationService n'est pas ouvert, laisse passer, sinon redirige vers accueil
            SitePasOuvertGardeService,
        ],
        resolve: {
            contexte: ContexteCatalogueResolverService,
        }
    },
    {
        path: ClientPages.commandes.urlSegment,
        data: { pageDef: ClientPages.commandes },
        canActivateChild: [
            // Lit l'état du site dans la bdd et si changé, met à jour les stockages du site
            // et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
            // et si le site a réouvert, affiche une fenêtre modale  d'information.
            // Laisse passer.
            LitEtatSiteEtLaissePasserGardeService,
            // Si le site de NavigationService est ouvert, laisse passer, sinon redirige vers pasOuvert
            SiteOuvertGardeService,
        ],
        loadChildren: () => import('./commandes/commande.module').then(mod => mod.CommandeModule),
    },
    {
        path: ClientPages.documents.urlSegment,
        data: { pageDef: ClientPages.documents },
        canActivateChild: [
            // Lit l'état du site dans la bdd et si changé, met à jour les stockages du site
            // et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
            // et si le site a réouvert, affiche une fenêtre modale  d'information.
            // Laisse passer.
            LitEtatSiteEtLaissePasserGardeService,
        ],
        loadChildren: () => import('./documents/c-document.module').then(mod => mod.CDocumentModule),
    },
    {
        path: AppPages.compte.urlSegment,
        canActivateChild: [
            // Lit l'état du site dans la bdd et si changé, met à jour les stockages du site
            // et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
            // et si le site a réouvert, affiche une fenêtre modale  d'information.
            // Laisse passer.
            LitEtatSiteEtLaissePasserGardeService,
        ],
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
