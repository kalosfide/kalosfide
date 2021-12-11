import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientPages } from './client-pages';
import { CAccueilComponent } from './c-accueil.component';
import { AppPages } from '../app-pages';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { CProduitsComponent } from './c-produits.component';
import { SiteOuvertGardeService } from '../site/site-ouvert-garde.service';
import { CatalogueResolverService } from '../modeles/catalogue/catalogue-resolver.service';
import { SitePasOuvertComponent } from './site-pas-ouvert.component';
import { SitePasOuvertGardeService } from './site-pas-ouvert-garde.service';
import { ContexteCatalogueResolverService } from './contexte-catalogue-resolver.service';
import { LitEtatSiteEtLaissePasserGardeService } from './lit-etat-site-et-laisse-passer-garde.service';
import { AppSitePages } from '../app-site/app-site-pages';

const routes: Routes = [
    {
        path: '',
        redirectTo: ClientPages.accueil.path,
        pathMatch: 'full',
    },
    {
        path: ClientPages.accueil.path,
        data: { pageDef: undefined },
        component: CAccueilComponent,
        canActivate: [
            // Lit l'état du site dans la bdd et si changé, met à jour les stockages du site
            // et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
            // et si le site a réouvert, affiche une fenêtre modale  d'information.
            // Laisse passer.
            LitEtatSiteEtLaissePasserGardeService
        ],
    },
    {
        path: ClientPages.catalogue.path,
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
        path: ClientPages.pasOuvert.path,
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
        path: ClientPages.commandes.path,
        data: { pageDef: ClientPages.commandes },
        loadChildren: () => import('./commandes/commande.module').then(mod => mod.CommandeModule),
    },
    {
        path: ClientPages.documents.path,
        data: { pageDef: ClientPages.documents },
        loadChildren: () => import('./documents/c-document.module').then(mod => mod.CDocumentModule),
    },
    {
        path: AppSitePages.compte.path,
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
export class ClientRoutingModule { }
