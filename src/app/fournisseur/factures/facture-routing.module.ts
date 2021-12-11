import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturePages } from './facture-pages';
import { FactureClientsComponent } from './facture-clients.component';
import { FactureBonsComponent } from './facture-bons.component';
import { FactureClientComponent } from './facture-client.component';
import { FactureEnvoiComponent } from './facture-envoi.component';
import { FactureSynthèseResolverService } from './facture-synthese-resolver.service';
import { FactureEnvoiGardeService } from './facture-envoi-garde.service';
import { FactureBonLignesComponent } from './facture-bon-lignes.component';
import { FactureBonNouveauComponent } from './facture-bon-nouveau.component';
import { FactureBonSupprimeComponent } from './facture-bon-supprime.component';
import { FactureLigneAjouteComponent } from './facture-ligne-ajoute.component';
import { FactureLigneResolverService } from './facture-ligne-resolver.service';
import { FactureChoixProduitComponent } from './facture-choix-produit.component';
import { FactureTitreComponent } from './facture-titre.component';
import { NomParam } from 'src/app/modeles/nom-param';
import { LFClientsResolverService } from '../l-f-clients-resolver.service';
import { LFBonsResolverService } from '../l-f-bons-resolver.service';
import { LFBonResolverService } from '../l-f-bon-resolver.service';
import { LFAttenteBonsGardeService } from '../l-f-attente-bons-garde.service';
import { LFEnfantsDeBonGardeService } from '../l-f-enfants-de-bon-garde.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: FacturePages.choixClient.path,
                pathMatch: 'full',
            },
            {
                /**
                 * Page titre
                 */
                path: FacturePages.choixClient.path,
                component: FactureTitreComponent,
                children: [
                    {
                        /**
                         * Page de choix du client pour lequel on veut créer un document de synthèse.
                         * Table de tous les clients avec leurs nombres de bons à synthétiser et des liens vers ./client/:key.
                         */
                        path: '',
                        data: {
                            pageDef: FacturePages.choixClient,
                            estEnfantPathVide: true,
                            typeCLF: 'facture'
                        },
                        component: FactureClientsComponent,
                        resolve: {
                            clfDocs: LFClientsResolverService,
                        },
                    }
                ]
            },
            {
                /**
                 * Page titre contenant toutes les pages d'édition d'une synthèse d'un client.
                 */
                path: FacturePages.client.path + '/:' + NomParam.keyClient,
                data: {
                    pageDef: FacturePages.client,
                    cheminDeTitre: ['clfDocs', 'client', 'nom'],
                    pageDefDescendantParDéfaut: FacturePages.bons,
                    typeCLF: 'facture'
                },
                component: FactureClientComponent,
                canActivate: [
                    // Bloque la route tant que le stock n'est pas chargé
                    // Fixe le stock avec les bons à synthétiser du client
                    LFAttenteBonsGardeService,
                ],
                resolve: {
                    // Fixe le stock avec les bons à synthétiser du client
                    clfDocs: LFBonsResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: FacturePages.bons.path,
                        pathMatch: 'full',
                    },
                    {
                        /**
                         * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
                         * Table des bons du client avec leur état de préparation, lien vers ./bon/:no et case de sélection.
                         * Bouton: Créer synthèse.
                         */
                        path: FacturePages.bons.path,
                        data: {
                            pageDef: FacturePages.bons,
                            estEnfantPathVide: true
                        },
                        component: FactureBonsComponent,
                        resolve: {
                            clfDocs: LFBonsResolverService,
                        },
                    },
                    {
                        path: FacturePages.envoi.path,
                        data: {
                            pageDef: FacturePages.envoi,
                            typeCLF: 'facture'
                        },
                        component: FactureEnvoiComponent,
                        canActivate: [
                            FactureEnvoiGardeService,
                        ],
                        resolve: {
                            clfDoc: FactureSynthèseResolverService,
                        },
                    },
                    {
                        /**
                         * Route sans page contenant toutes les pages d'édition d'un document.
                         */
                        path: FacturePages.bon.path + '/:' + NomParam.noDoc,
                        data: {
                            pageDef: FacturePages.bon,
                            pageDefDescendantParDéfaut: FacturePages.lignes,
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
                                redirectTo: FacturePages.lignes.path,
                                pathMatch: 'full',
                            },
                            {
                                path: FacturePages.lignes.path,
                                data: {
                                    pageDef: undefined,
                                    estEnfantPathVide: true
                                },
                                component: FactureBonLignesComponent,
                                resolve: {
                                    clfDoc: LFBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.nouveau.path,
                                data: { pageDef: FacturePages.nouveau },
                                component: FactureBonNouveauComponent,
                                resolve: {
                                    // Lit le stock. Crée le cflDoc.
                                    clfDoc: LFBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.annule.path,
                                data: { pageDef: FacturePages.annule },
                                component: FactureBonSupprimeComponent,
                                resolve: {
                                    clfDoc: LFBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.choixProduit.path,
                                data: { pageDef: FacturePages.choixProduit },
                                component: FactureChoixProduitComponent,
                                resolve: {
                                    clfDoc: LFBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.ajoute.path + '/:' + NomParam.noLigne,
                                data: {
                                    pageDef: FacturePages.ajoute,
                                    cheminDeKey: ['clfLigne', 'produit', 'nom']
                                },
                                component: FactureLigneAjouteComponent,
                                resolve: {
                                    clfLigne: FactureLigneResolverService,
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
export class FactureRoutingModule { }
