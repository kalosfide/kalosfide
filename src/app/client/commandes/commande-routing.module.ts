import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandeAccueilComponent } from './commande-accueil.component';
import { CommandeChoixProduitComponent } from './commande-choix-produit.component';
import { CommandeLigneAjouteComponent } from './commande-ligne-ajoute.component';
import { CommandeLigneSupprimeComponent } from './commande-ligne-supprime.component';
import { CommandeBonResolverService } from './commande-bon-resolver.service';
import { RedirigeSiContexteChangé, RedirigeSiPasContexte } from './contexte-change-garde';
import { CommandePages } from './commande-pages';
import { CommandeBonComponent } from './commande-bon.component';
import { CommandeAnnuleComponent } from './commande-annule.component';
import { CommandeContexteComponent } from './commande-contexte.component';
import { CommandeDoitCréerGardeService } from './commande-doit-creer-garde.service';
import { CommandeBonExisteGardeService } from './commande-bon-existe-garde.service';
import { CommandeEnvoiGardeService } from './commande-envoi-garde.service';
import { CommandeNouveauComponent } from './commande-nouveau.component';
import { CommandeLigneResolverService } from './commande-ligne-resolver.service';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';
import { CommandeEnvoiComponent } from './commande-envoi.component';
import { CommandeProduitPasDansBonGardeService } from './commande-produit-pas-dans-bon-garde.service';
import { CommandeContexteResolverService } from './commande-contexte-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: CommandeAccueilComponent,
        children: [
            {
                path: '',
                redirectTo: CommandePages.bon.urlSegment,
                pathMatch: 'full',
            },
            {
                path: CommandePages.bon.urlSegment,
                data: {
                    pageDef: CommandePages.bon,
                    estEnfantPathVide: true
                },
                canActivate: [
                    // Charge le contexte.
                    // Si site pas ouvert ou catalogue périmé, stocke le contexte et redirige vers .contexte
                    // Sinon, si le stock n'existe pas, charge et stocke le cflDocs
                    RedirigeSiContexteChangé,
                ],
                canActivateChild: [
                    RedirigeSiContexteChangé,
                ],
                resolve: {
                    // pour que les gardes des enfants aient accès au résolu de la route
                    // Lit le stock. Crée le cflDoc.
                    clfDoc: CommandeBonResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: CommandePages.lignes.urlSegment,
                        pathMatch: 'full',
                    },
                    {
                        path: CommandePages.lignes.urlSegment,
                        data: { pageDef: undefined },
                        component: CommandeBonComponent,
                        canActivate: [
                            // Lit le stock.
                            // Redirige vers ./nouveau si le document n'existe pas ou est fermé
                            CommandeBonExisteGardeService,
                        ],
                        resolve: {
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: CommandeBonResolverService,
                        },
                    },
                    {
                        path: CommandePages.nouveau.urlSegment,
                        data: {
                            pageDef: CommandePages.nouveau,
                        },
                        component: CommandeNouveauComponent,
                        canActivate: [
                            // Lit le stock.
                            // Redirige vers ./lignes si le document existe et est ouvert
                            CommandeDoitCréerGardeService,
                        ],
                        resolve: {
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: CommandeBonResolverService,
                        },
                    },
                    {
                        path: CommandePages.choixProduit.urlSegment,
                        data: {
                            pageDef: CommandePages.choixProduit,
                            estEnfantPathVide: undefined,
                        },
                        component: CommandeChoixProduitComponent,
                        canActivate: [
                            // Lit le stock.
                            // Redirige vers ./nouveau si le document n'existe pas ou est fermé
                            CommandeBonExisteGardeService,
                        ],
                        resolve: {
                            clfDoc: CommandeBonResolverService
                        },
                    },
                    {
                        path: CommandePages.ajoute.urlSegment + '/:' + CLFPages.nomParamNoLigne,
                        data: {
                            pageDef: CommandePages.ajoute,
                            estEnfantPathVide: undefined,
                            cheminDeKey: ['clfLigne', 'produit', 'nom']
                        },
                        component: CommandeLigneAjouteComponent,
                        canActivate: [
                            // Lit le stock.
                            // Redirige vers ./nouveau si le document n'existe pas ou est fermé
                            CommandeBonExisteGardeService,
                            CommandeProduitPasDansBonGardeService,
                        ],
                        resolve: {
                            clfLigne: CommandeLigneResolverService,
                        },
                    },
                    {
                        path: CommandePages.supprime.urlSegment + '/:' + CLFPages.nomParamNoLigne,
                        data: { pageDef: CommandePages.supprime },
                        component: CommandeLigneSupprimeComponent,
                        canActivate: [
                            // Lit le stock.
                            // Redirige vers ./nouveau si le document n'existe pas ou est fermé
                            CommandeBonExisteGardeService,
                        ],
                        resolve: {
                            clfLigne: CommandeLigneResolverService,
                        },
                    },
                    {
                        path: CommandePages.annule.urlSegment,
                        data: { pageDef: CommandePages.annule },
                        component: CommandeAnnuleComponent,
                        canActivate: [
                            // Lit le stock.
                            // Redirige vers ./nouveau si le document n'existe pas ou est fermé
                            CommandeBonExisteGardeService,
                        ],
                        resolve: {
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: CommandeBonResolverService,
                        },
                    },
                ]
            },
            {
                path: CommandePages.envoi.urlSegment,
                data: { pageDef: CommandePages.envoi },
                component: CommandeEnvoiComponent,
                canActivate: [
                    RedirigeSiContexteChangé,
                    // Lit le stock.
                    // Redirige vers ./nouveau si le document n'existe pas ou est fermé
                    CommandeBonExisteGardeService,
                    CommandeEnvoiGardeService,
                ],
                resolve: {
                    // Lit le stock. Crée le cflDoc.
                    clfDoc: CommandeBonResolverService,
                },
            },
            {
                path: CommandePages.contexte.urlSegment,
                data: { pageDef: CommandePages.contexte },
                component: CommandeContexteComponent,
                canActivate: [
                    // Lit le stock.
                    // Si le stock n'existe pas ou n'est pas un contexte, redirige vers .bon
                    RedirigeSiPasContexte,
                ],
                resolve: {
                    // Lit le stock.
                    contexte: CommandeContexteResolverService,
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
