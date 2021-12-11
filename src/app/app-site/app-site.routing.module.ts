import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSitePages } from './app-site-pages';
import { AppPages } from '../app-pages';
import { PageErreurComponent } from '../erreurs/page-erreur.component';
import { AppSiteAProposComponent } from './app-site-a-propos.component';
import { AppSitePeupleComponent } from './app-site-peuple.component';
import { AppSiteContactComponent } from './app-site-contact.component';
import { AppSiteComponent } from './app-site.component';
import { NouveauSiteComponent } from './nouveau-site/nouveau-site.component';
import { PeupleResolverService } from './peuple-resolver.service';
import { IdentifiantResolverService } from './identifiant-resolver.service';
import { AppSiteAccueilComponent } from './app-site-accueil.component';
import { DevenirClientComponent } from './devenir-client/devenir-client.component';
import { DevenirClientResolverService } from './devenir-client/devenir-client-resolver.service';
import { ApiErreurResolverService } from '../erreurs/api-erreur-resolver.service';
import { IdentifiantRole0GardeService } from './identifiant-role-0-garde.service';
import { NouveauSiteResolverService } from './nouveau-site/nouveau-site-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: AppSiteComponent,
        canActivate: [
            IdentifiantRole0GardeService
        ],
        resolve: {
            identifiant: IdentifiantResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: AppSitePages.accueil.path,
                pathMatch: 'full',
            },
            {
                path: AppSitePages.accueil.path,
                component: AppSiteAccueilComponent,
                data: {
                    pageDef: AppSitePages.accueil,
                    estEnfantPathVide: true
                },
            },
            {
                path: AppSitePages.peuple.path,
                data: { pageDef: AppSitePages.peuple },
                component: AppSitePeupleComponent,
                resolve: {
                    estPeuplé: PeupleResolverService,
                }
            },
            {
                path: AppSitePages.contact.path,
                data: { pageDef: AppSitePages.contact },
                component: AppSiteContactComponent
            },
            {
                path: AppSitePages.apropos.path,
                data: { pageDef: AppSitePages.apropos },
                component: AppSiteAProposComponent,
            },
            {
                path: AppSitePages.nouveauSite.path,
                data: { pageDef: AppSitePages.nouveauSite },
                component: NouveauSiteComponent,
                resolve: {
                    nouveauSite: NouveauSiteResolverService,
                },
            },
            {
                path: AppSitePages.devenirClient.path,
                data: {
                    pageDef: AppSitePages.devenirClient,
                 },
                component: DevenirClientComponent,
                resolve: {
                    invitation: DevenirClientResolverService,
                },
            },
            {
                path: AppSitePages.compte.path,
                loadChildren: () => import('../compte/compte.module').then(mod => mod.CompteModule)
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
export class AppSiteRoutingModule { }
