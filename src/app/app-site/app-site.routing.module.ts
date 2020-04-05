import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSitePages } from './app-site-pages';
import { AppPages } from '../app-pages';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { AppSiteSitesComponent } from './app-site-sites.component';
import { SitesResolverService } from './app-site-sites-resolver.service';
import { AppSiteAProposComponent } from './app-site-a-propos.component';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';
import { AppSiteIndexComponent } from './app-site-index.component';
import { AppSiteContactComponent } from './app-site-contact.component';
import { AppSiteComponent } from './app-site.component';
import { DevenirFournisseurComponent } from './devenir-fournisseur/devenir-fournisseur.component';
import { EtapeDeFormulaireComponent } from '../disposition/formulaire/etape-de-formulaire.component';
import { DevenirFournisseurPages } from './devenir-fournisseur/devenir-fournisseur-pages';
import { MotDePasseResolverService } from '../securite/mot-de-passe/mot-de-passe-resolver.service';
import { PeutQuitterGarde } from '../commun/peut-quitter/peut-quitter-garde.service';
import { PeupleResolverService } from './peuple-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: AppSiteComponent,
        children: [
            {
                path: '',
                redirectTo: AppSitePages.index.urlSegment,
                pathMatch: 'full',
            },
            {
                path: AppSitePages.index.urlSegment,
                component: AppSiteIndexComponent,
                data: {
                    pageDef: AppSitePages.index,
                    estEnfantPathVide: true
                },
                resolve: {
                    estPeuplé: PeupleResolverService,
                },
            },
            {
                path: AppSitePages.sites.urlSegment,
                data: { pageDef: AppSitePages.sites },
                component: AppSiteSitesComponent,
                resolve: {
                    sites: SitesResolverService,
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
                resolve: {
                    motDePasse: MotDePasseResolverService,
                },
                canDeactivate: [PeutQuitterGarde],
                children: [
                    {
                        path: '',
                        redirectTo: DevenirFournisseurPages.connection.urlSegment,
                        pathMatch: 'full',
                    },
                    {
                        path: DevenirFournisseurPages.connection.urlSegment,
                        component: EtapeDeFormulaireComponent,
                        data: { index: 0 }
                    },
                    {
                        path: DevenirFournisseurPages.profil.urlSegment,
                        component: EtapeDeFormulaireComponent,
                        data: { index: 1 }
                    },
                    {
                        path: DevenirFournisseurPages.site.urlSegment,
                        component: EtapeDeFormulaireComponent,
                        data: { index: 2 }
                    },
                    {
                        path: DevenirFournisseurPages.validation.urlSegment,
                        component: EtapeDeFormulaireComponent,
                        data: { index: 3 }
                    },
                    {
                        path: '*',
                        redirectTo: DevenirFournisseurPages.connection.urlSegment,
                        pathMatch: 'full',
                    },
                ],
            },
            {
                path: AppPages.compte.urlSegment,
                data: { pageDef: AppPages.compte },
                loadChildren: () => import('../compte/compte.module').then(mod => mod.CompteModule)
            },
            // pages d'erreur
            {
                path: AppPages.interdit.urlSegment,
                data: { pageDef: AppPages.interdit },
                component: PageInterditeComponent
            },
            {
                path: AppPages.conflit.urlSegment,
                data: { pageDef: AppPages.conflit },
                component: PageConflitComponent
            },
            {
                path: AppPages.apiErreur.urlSegment,
                data: { pageDef: AppPages.apiErreur },
                component: PageErreurComponent,
            },
            {
                path: AppPages.introuvable.urlSegment,
                data: { pageDef: AppPages.introuvable },
                component: PageIntrouvableComponent,
            },
            {
                path: '**',
                redirectTo: AppPages.introuvable.urlSegment,
            },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppSiteRoutingModule { }
