import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSitePages } from './app-site-pages';
import { AppPages } from '../app-pages';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { AppSiteAProposComponent } from './app-site-a-propos.component';
import { AppSitePeupleComponent } from './app-site-peuple.component';
import { AppSiteContactComponent } from './app-site-contact.component';
import { AppSiteComponent } from './app-site.component';
import { DevenirFournisseurComponent } from './devenir-fournisseur/devenir-fournisseur.component';
import { PeupleResolverService } from './peuple-resolver.service';
import { IdentifiantResolverService } from '../securite/identifiant-resolver.service';
import { AppSiteAccueilComponent } from './app-site-accueil.component';
import { DevenirClientComponent } from './devenir-client/devenir-client.component';
import { DevenirClientResolverService } from './devenir-client/devenir-client-resolver.service';
import { IdentifiantGardeService } from '../securite/identifant-garde.service';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { ModalErreurComponent } from '../erreurs/modal-erreur.component';

const routes: Routes = [
    {
        path: '',
        component: AppSiteComponent,
        resolve: {
            identifiant: IdentifiantResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: AppSitePages.accueil.urlSegment,
                pathMatch: 'full',
            },
            {
                path: AppSitePages.accueil.urlSegment,
                component: AppSiteAccueilComponent,
                data: {
                    pageDef: AppSitePages.accueil,
                    estEnfantPathVide: true
                },
            },
            {
                path: AppSitePages.peuple.urlSegment,
                data: { pageDef: AppSitePages.peuple },
                component: AppSitePeupleComponent,
                resolve: {
                    estPeuplé: PeupleResolverService,
                }
            },
            {
                path: AppSitePages.contact.urlSegment,
                data: { pageDef: AppSitePages.contact },
                component: AppSiteContactComponent
            },
            {
                path: AppSitePages.apropos.urlSegment,
                data: { pageDef: AppSitePages.apropos },
                component: AppSiteAProposComponent,
            },
            {
                path: AppSitePages.devenirFournisseur.urlSegment,
                data: { pageDef: AppSitePages.devenirFournisseur },
                component: DevenirFournisseurComponent,
                canActivate: [
                    IdentifiantGardeService,
                ]
            },
            {
                path: AppSitePages.devenirClient.urlSegment,
                data: {
                    pageDef: AppSitePages.devenirClient,
                 },
                component: DevenirClientComponent,
                resolve: {
                    invitation: DevenirClientResolverService,
                },
            },
            {
                path: AppPages.compte.urlSegment,
                data: { pageDef: AppPages.compte },
                loadChildren: () => import('../compte/compte.module').then(mod => mod.CompteModule)
            },
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
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppSiteRoutingModule { }
