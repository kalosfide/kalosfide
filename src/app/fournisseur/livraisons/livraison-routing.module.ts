import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LivraisonPages } from './livraison-pages';

import { LivraisonBonLignesComponent } from './livraison-bon-lignes.component';
import { LivraisonClientsComponent } from './livraison-clients.component';

import { LivraisonClientComponent } from './livraison-client.component';
import { LivraisonChoixProduitComponent } from './livraison-choix-produit.component';
import { LivraisonLigneAjouteComponent } from './livraison-ligne-ajoute.component';
import { LivraisonBonsComponent } from './livraison-bons.component';
import { LivraisonLigneResolverService } from './livraison-ligne-resolver.service';
import { LivraisonEnvoiComponent } from './livraison-envoi.component';
import { LivraisonSynthèseResolverService } from './livraison-synthese-resolver.service';
import { LivraisonBonNouveauComponent } from './livraison-bon-nouveau.component';
import { LivraisonTitreComponent } from './livraison-titre.component';
import { NomParam } from 'src/app/modeles/nom-param';
import { LFClientsResolverService } from '../l-f-clients-resolver.service';
import { LFBonsResolverService } from '../l-f-bons-resolver.service';
import { LFBonResolverService } from '../l-f-bon-resolver.service';
import { LFEnvoiGardeService } from '../l-f-envoi-garde.service';
import { LFAttenteBonsGardeService } from '../l-f-attente-bons-garde.service';
import { LFEnfantsDeBonGardeService } from '../l-f-enfants-de-bon-garde.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: LivraisonPages.choixClient.path,
                pathMatch: 'full',
            },
            {
                /**
                 * Page titre
                 */
                path: LivraisonPages.choixClient.path,
                component: LivraisonTitreComponent,
                children: [
                    {
                    /**
                     * Page de choix du client pour lequel on veut créer un document de synthèse.
                     * Table de tous les clients avec leurs nombres de bons à synthétiser et des liens vers ./client/:key.
                     */
                    path: '',
                    data: {
                        pageDef: LivraisonPages.choixClient,
                        estEnfantPathVide: true,
                        typeCLF: 'livraison'
                    },
                    component: LivraisonClientsComponent,
                    resolve: {
                        // clients avec leurs nombres de bons envoyés
                        clfDocs: LFClientsResolverService,
                    },
                    }
                ]
            },
            {
                /**
                 * Page titre contenant toutes les pages d'édition d'une synthèse d'un client.
                 * key: key du client
                 */
                path: LivraisonPages.client.path + '/:' + NomParam.keyClient,
                data: {
                    pageDef: LivraisonPages.client,
                    cheminDeTitre: ['clfDocs', 'client', 'nom'],
                    pageDefDescendantParDéfaut: LivraisonPages.bons,
                    typeCLF: 'livraison'
                },
                component: LivraisonClientComponent,
                canActivate: [
                    // Bloque la route tant que le stock n'est pas chargé
                    // Fixe le stock avec les bons à synthétiser du client
                    LFAttenteBonsGardeService,
                ],
                resolve: {
                    // Lit le stock
                    clfDocs: LFBonsResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: LivraisonPages.bons.path,
                        pathMatch: 'full',
                    },
                    {
                        /**
                         * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
                         * Table des bons du client avec leur état de préparation, lien vers ./bon/:no et case de sélection.
                         * Bouton: Créer synthèse.
                         */
                        path: LivraisonPages.bons.path,
                        data: {
                            pageDef: LivraisonPages.bons,
                            estEnfantPathVide: true
                        },
                        component: LivraisonBonsComponent,
                        resolve: {
                            clfDocs: LFBonsResolverService,
                        },
                    },
                    {
                        path: LivraisonPages.envoi.path,
                        data: {
                            pageDef: LivraisonPages.envoi,
                            typeCLF: 'livraison',
                        },
                        component: LivraisonEnvoiComponent,
                        canActivate: [
                            LFEnvoiGardeService,
                        ],
                        resolve: {
                            clfDoc: LivraisonSynthèseResolverService,
                        },
                    },
                    {
                        /**
                         * Route sans page contenant toutes les pages d'édition d'un document.
                         */
                        path: LivraisonPages.bon.path + '/:' + NomParam.noDoc,
                        data: {
                            pageDef: LivraisonPages.bon,
                            pageDefDescendantParDéfaut: LivraisonPages.lignes,
                            cheminDeKey: ['clfDoc', 'no']
                        },
                        canActivateChild: [
                            // Si le stock n'existe pas ou si keyClient ou no a changé, charge et stocke le cflDocs
                            LFEnfantsDeBonGardeService
                        ],
                        resolve: {
                            // pour que les gardes des enfants aient accès au résolu de la route
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: LFBonResolverService,
                        },
                        children: [
                            {
                                path: '',
                                redirectTo: LivraisonPages.lignes.path,
                                pathMatch: 'full',
                            },
                            {
                                path: LivraisonPages.lignes.path,
                                data: {
                                    pageDef: undefined,
                                    estEnfantPathVide: true
                                },
                                component: LivraisonBonLignesComponent,
                                resolve: {
                                    clfDoc: LFBonResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.nouveau.path,
                                data: { pageDef: LivraisonPages.nouveau },
                                component: LivraisonBonNouveauComponent,
                                resolve: {
                                    // Lit le stock. Crée le cflDoc.
                                    clfDoc: LFBonResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.choixProduit.path,
                                data: {
                                    pageDef: LivraisonPages.choixProduit,
                                    cheminDeKey: undefined
                                },
                                component: LivraisonChoixProduitComponent,
                                resolve: {
                                    clfDoc: LFBonResolverService,
                                },
                            },
                            {
                                path: LivraisonPages.ajoute.path + '/:' + NomParam.noLigne,
                                data: {
                                    pageDef: LivraisonPages.ajoute,
                                    cheminDeKey: ['clfLigne', 'produit', 'nom']
                                },
                                component: LivraisonLigneAjouteComponent,
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
