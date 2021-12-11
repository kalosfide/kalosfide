import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NomParam } from 'src/app/modeles/nom-param';
import { CommandePages } from './commande-pages';
import { CommandeAccueilComponent } from './commande-accueil.component';
import { CommandeBonResolverService } from './commande-bon-resolver.service';
import { CEnfantsDeBonGardeService } from './c-enfants-de-bon-garde.service';
import { CommandeBonComponent } from './commande-bon.component';
import { CommandeChoixProduitComponent } from './commande-choix-produit.component';
import { CommandeLigneAjouteComponent } from './commande-ligne-ajoute.component';
import { CommandeAnnuleComponent } from './commande-annule.component';
import { CommandeNouveauComponent } from './commande-nouveau.component';
import { CommandeLigneResolverService } from './commande-ligne-resolver.service';
import { CommandeEnvoiGardeService } from './commande-envoi-garde.service';
import { CommandeEnvoiComponent } from './commande-envoi.component';

const routes: Routes = [
    {
        path: '',
        // Page titre de la section commande
        component: CommandeAccueilComponent,
        children: [
            {
                path: '',
                redirectTo: CommandePages.bon.path,
                pathMatch: 'full',
            },
            {
                // path sans page
                path: CommandePages.bon.path,
                data: {
                    pageDef: CommandePages.bon,
                    estEnfantPathVide: true
                },
                canActivateChild: [
                    // Charge le contexte.
                    // Si site pas ouvert ou catalogue périmé, stocke le contexte et redirige vers .../pasOuvert
                    // Sinon, si le stock n'existe pas, charge et stocke le cflDocs
                    CEnfantsDeBonGardeService,
                ],
                children: [
                    {
                        path: '',
                        redirectTo: CommandePages.lignes.path,
                        pathMatch: 'full',
                    },
                    {
                        path: CommandePages.lignes.path,
                        data: { pageDef: undefined },
                        component: CommandeBonComponent,
                        resolve: {
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: CommandeBonResolverService,
                        },
                    },
                    {
                        path: CommandePages.nouveau.path,
                        data: {
                            pageDef: CommandePages.nouveau,
                        },
                        component: CommandeNouveauComponent,
                        resolve: {
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: CommandeBonResolverService,
                        },
                    },
                    {
                        path: CommandePages.choixProduit.path,
                        data: {
                            pageDef: CommandePages.choixProduit,
                            estEnfantPathVide: undefined,
                        },
                        component: CommandeChoixProduitComponent,
                        resolve: {
                            clfDoc: CommandeBonResolverService
                        },
                    },
                    {
                        path: CommandePages.ajoute.path + '/:' + NomParam.noLigne,
                        data: {
                            pageDef: CommandePages.ajoute,
                            estEnfantPathVide: undefined,
                            cheminDeKey: ['clfLigne', 'produit', 'nom']
                        },
                        component: CommandeLigneAjouteComponent,
                        resolve: {
                            clfLigne: CommandeLigneResolverService,
                        },
                    },
                    {
                        path: CommandePages.annule.path,
                        data: { pageDef: CommandePages.annule },
                        component: CommandeAnnuleComponent,
                        resolve: {
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: CommandeBonResolverService,
                        },
                    },
                ]
            },
            {
                path: CommandePages.envoi.path,
                data: { pageDef: CommandePages.envoi },
                component: CommandeEnvoiComponent,
                canActivate: [
                    CommandeEnvoiGardeService,
                ],
                resolve: {
                    // Lit le stock. Crée le cflDoc.
                    clfDoc: CommandeBonResolverService,
                },
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommandeRoutingModule { }
