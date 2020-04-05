import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VAccueilComponent } from './v-accueil.component';
import { VContactComponent } from './v-contact.component';
import { VAProposComponent } from './v-apropos.component';
import { EtapeDeFormulaireComponent } from '../disposition/formulaire/etape-de-formulaire.component';
import { DevenirClientComponent } from './devenir-client/devenir-client.component';
import { DevenirClientPages } from './devenir-client/devenir-client-pages';
import { MotDePasseResolverService } from '../securite/mot-de-passe/mot-de-passe-resolver.service';
import { VProduitsComponent } from './v-produits.component';
import { AppPages } from '../app-pages';
import { SiteOuvertGarde } from '../securite/site-ouvert-garde';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { SitePasOuvertComponent } from '../messages/site-pas-ouvert.component';
import { VisiteurPages } from './visiteur-pages';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';
import { CatalogueResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: VisiteurPages.accueil.urlSegment,
        pathMatch: 'full',
    },
    {
        path: VisiteurPages.accueil.urlSegment,
        component: VAccueilComponent,
    },
    {
        path: VisiteurPages.produits.urlSegment,
        data: { pageDef: VisiteurPages.produits },
        component: VProduitsComponent,
        resolve: {
            catalogue: CatalogueResolverService,
        },
        canActivate: [SiteOuvertGarde]
    },
    {
        path: VisiteurPages.contact.urlSegment,
        data: { pageDef: VisiteurPages.contact },
        component: VContactComponent,
    },
    {
        path: VisiteurPages.apropos.urlSegment,
        data: { pageDef: VisiteurPages.apropos },
        component: VAProposComponent,
    },
    {
        path: VisiteurPages.devenirClient.urlSegment,
        data: { pageDef: VisiteurPages.devenirClient },
        component: DevenirClientComponent,
        resolve: {
            motDePasse: MotDePasseResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: DevenirClientPages.connection.urlSegment,
                pathMatch: 'full',
            },
            {
                path: DevenirClientPages.connection.urlSegment,
                component: EtapeDeFormulaireComponent,
                data: { index: 0 }
            },
            {
                path: DevenirClientPages.profil.urlSegment,
                component: EtapeDeFormulaireComponent,
                data: { index: 1 }
            },
            {
                path: DevenirClientPages.validation.urlSegment,
                component: EtapeDeFormulaireComponent,
                data: { index: 2 }
            },
            {
                path: '**',
                redirectTo: DevenirClientPages.connection.urlSegment,
                pathMatch: 'full',
            },
        ],
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
        path: AppPages.pasOuvert.urlSegment,
        component: SitePasOuvertComponent,
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
export class VisiteurRoutingModule { }
