import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LivraisonPages } from './livraison-pages';

import { LivraisonBonLignesComponent } from './livraison-bon-lignes.component';
import { LivraisonClientsComponent } from './livraison-clients.component';

import { LivraisonClientsResolverService } from './livraison-clients-resolver.service';
import { LivraisonClientComponent } from './livraison-client.component';
import { LivraisonChoixProduitComponent } from './livraison-choix-produit.component';
import { LivraisonLigneAjouteComponent } from './livraison-ligne-ajoute.component';
import { LivraisonLigneSupprimeComponent } from './livraison-ligne-supprime.component';
import { LivraisonBonSupprimeComponent } from './livraison-bon-supprime.component';
import { LivraisonBonsComponent } from './livraison-bons.component';
import { LivraisonBonsResolverService } from './livraison-bons-resolver.service';
import { LivraisonBonResolverService } from './livraison-bon-resolver.service';
import { LivraisonBonVirtuelGardeService } from './livraison-bon-virtuel-garde.service';
import { LivraisonLigneResolverService } from './livraison-ligne-resolver.service';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';
import { LivraisonEnvoiComponent } from './livraison-envoi.component';
import { LivraisonSynthèseResolverService } from './livraison-synthese-resolver.service';
import { LivraisonDoitCréerGardeService } from './livraison-doit-creer-garde.service';
import { LivraisonBonExisteGardeService } from './livraison-bon-existe-garde.service';
import { LivraisonAttenteBonsGardeService } from './livraison-attente-bons-garde.service';
import { LivraisonEnvoiGardeService } from './livraison-envoi-garde.service';
import { LivraisonBonNouveauComponent } from './livraison-bon-nouveau.component';
import { LivraisonProduitPasDansBonGardeService } from './livraison-produit-pas-dans-bon-garde.service';
import { LivraisonTitreComponent } from './livraison-titre.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: LivraisonPages.choixClient.urlSegment,
                pathMatch: 'full',
            },
            {
                /**
                 * Page titre
                 */
                path: LivraisonPages.choixClient.urlSegment,
                data: {
                    pageDef: LivraisonPages.choixClient,
                    estEnfantPathVide: true
                },
                component: LivraisonTitreComponent,
                children: [
                    {
                    /**
                     * Page de choix du client pour lequel on veut créer un document de synthèse.
                     * Table de tous les clients avec leurs nombres de bons à synthétiser et des liens vers ./client/:key.
                     */
                    path: '',
                    component: LivraisonClientsComponent,
                    resolve: {
                        // clients avec leurs nombres de bons envoyés
                        clfDocs: LivraisonClientsResolverService,
                    },
                    }
                ]
            },
            {
                /**
                 * Page titre contenant toutes les pages d'édition d'une synthèse d'un client.
                 * key: key du client
                 */
                path: LivraisonPages.client.urlSegment + '/:' + CLFPages.nomParamKeyClient,
                data: {
                    pageDef: LivraisonPages.client,
                    cheminDeTitre: ['clfDocs', 'client', 'nom'],
                    pageDefEnfantPathVide: LivraisonPages.bons,
                },
                component: LivraisonClientComponent,
                canActivate: [
                    // Bloque la route tant que le stock n'est pas chargé
                    // Fixe le stock avec les bons à synthétiser du client
                    // Redirige vers ./bon/0/nouveau s'il n'y a aucune commande
                    LivraisonAttenteBonsGardeService,
                ],
                resolve: {
                    // Lit le stock
                    clfDocs: LivraisonBonsResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: LivraisonPages.bons.urlSegment,
                        pathMatch: 'full',
                    },
                    {
                        /**
                         * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
                         * Table des bons du client avec leur état de préparation, lien vers ./bon/:no et case de sélection.
                         * Bouton: Créer synthèse.
                         */
                        path: LivraisonPages.bons.urlSegment,
                        data: {
                            pageDef: LivraisonPages.bons,
                            estEnfantPathVide: true
                        },
                        component: LivraisonBonsComponent,
                        resolve: {
                            clfDocs: LivraisonBonsResolverService,
                        },
                    },
                    {
                        path: LivraisonPages.envoi.urlSegment,
                        data: { pageDef: LivraisonPages.envoi },
                        component: LivraisonEnvoiComponent,
                        canActivate: [
                            LivraisonEnvoiGardeService,
                        ],
                        resolve: {
                            clfDoc: LivraisonSynthèseResolverService,
                        },
                    },
                    {
                        /**
                         * Route sans page contenant toutes les pages d'édition d'un document.
                         */
                        path: LivraisonPages.bon.urlSegment + '/:' + CLFPages.nomParamNoDoc,
                        data: {
                            pageDef: LivraisonPages.bon,
//                            pageDefEnfantPathVide: LivraisonPages.lignes
                        },
                        canActivateChild: [
                            // Si le stock n'existe pas ou si keyClient ou no a changé, charge et stocke le cflDocs
                            // ,
                        ],
                        resolve: {
                            // pour que les gardes des enfants aient accès au résolu de la route
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: LivraisonBonResolverService,
                        },
                        children: [
                            {
                                path: '',
                                redirectTo: LivraisonPages.lignes.urlSegment,
                                pathMatch: 'full',
                            },
                            {
                                path: LivraisonPages.lignes.urlSegment,
                                data: {
                                    pageDef: undefined,
                                    estEnfantPathVide: true
                                },
                                component: LivraisonBonLignesComponent,
                                canActivate: [
                                    // Lit le stock.
                                    // Redirige vers ./nouveau si noDoc = 0 et la commande virtuelle n'existe pas ou est envoyée
                                    LivraisonBonExisteGardeService,
                                ],
                                resolve: {
                                    clfDoc: LivraisonBonResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.nouveau.urlSegment,
                                data: { pageDef: LivraisonPages.nouveau },
                                component: LivraisonBonNouveauComponent,
                                canActivate: [
                                    // Lit le stock.
                                    // Redirige vers ./lignes si noDoc = 0 et la commande virtuelle existe et est ouverte
                                    // ou si noDoc > 0.
                                    // commandeEstVirtuelleEtNExistePasOuEstEnvoyée
                                    LivraisonDoitCréerGardeService,
                                ],
                                resolve: {
                                    // Lit le stock. Crée le cflDoc.
                                    clfDoc: LivraisonBonResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.annule.urlSegment,
                                data: { pageDef: LivraisonPages.annule },
                                component: LivraisonBonSupprimeComponent,
                                canActivate: [
                                    // Redirige vers ./nouveau si noDoc = 0 et la commande virtuelle n'existe pas ou est envoyée
                                    // Redirige vers ./lignes si noDoc != 0
                                    // commandeEstVirtuelleEtExisteEtEstOuverte
                                    LivraisonBonVirtuelGardeService
                                ],
                                resolve: {
                                    clfDoc: LivraisonBonResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.choixProduit.urlSegment,
                                data: { pageDef: LivraisonPages.choixProduit },
                                component: LivraisonChoixProduitComponent,
                                canActivate: [
                                    LivraisonBonVirtuelGardeService
                                ],
                                resolve: {
                                    clfDoc: LivraisonBonResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.ajoute.urlSegment + '/:' + CLFPages.nomParamNoLigne,
                                data: {
                                    pageDef: LivraisonPages.ajoute,
                                    cheminDeKey: ['clfLigne', 'produit', 'nom']
                                },
                                component: LivraisonLigneAjouteComponent,
                                canActivate: [
                                    LivraisonBonVirtuelGardeService,
                                    LivraisonProduitPasDansBonGardeService,
                                ],
                                resolve: {
                                    clfLigne: LivraisonLigneResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.supprime.urlSegment + '/:' + CLFPages.nomParamNoLigne,
                                data: { pageDef: LivraisonPages.supprime },
                                component: LivraisonLigneSupprimeComponent,
                                canActivate: [
                                    LivraisonBonVirtuelGardeService
                                ],
                                resolve: {
                                    clfLigne: LivraisonLigneResolverService,
                                },
                            },
                        ]
                    },
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        {
            provide: 'termineResolver',
            useValue: () => true
        }
    ]
})
export class LivraisonRoutingModule { }
