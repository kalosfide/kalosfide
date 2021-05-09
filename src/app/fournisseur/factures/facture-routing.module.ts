import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturePages } from './facture-pages';
import { FactureClientsComponent } from './facture-clients.component';
import { FactureBonsComponent } from './facture-bons.component';
import { FactureClientComponent } from './facture-client.component';
import { FactureClientsResolverService } from './facture-clients-resolver.service';
import { FactureBonsResolverService } from './facture-bons-resolver.service';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';
import { FactureBonResolverService } from './facture-bon-resolver.service';
import { FactureEnvoiComponent } from './facture-envoi.component';
import { FactureSynthèseResolverService } from './facture-synthese-resolver.service';
import { FactureAttenteBonsGardeService } from './facture-attente-bons-garde.service';
import { FactureEnvoiGardeService } from './facture-envoi-garde.service';
import { FactureBonLignesComponent } from './facture-bon-lignes.component';
import { FactureBonExisteGardeService } from './facture-bon-existe-garde.service';
import { FactureBonNouveauComponent } from './facture-bon-nouveau.component';
import { FactureDoitCréerGardeService } from './facture-doit-creer-garde.service';
import { FactureBonSupprimeComponent } from './facture-bon-supprime.component';
import { FactureBonVirtuelGardeService } from './facture-bon-virtuel-garde.service';
import { FactureLigneAjouteComponent } from './facture-ligne-ajoute.component';
import { FactureLigneResolverService } from './facture-ligne-resolver.service';
import { FactureChoixProduitComponent } from './facture-choix-produit.component';
import { FactureProduitPasDansBonGardeService } from './facture-produit-pas-dans-bon-garde.service';
import { FactureTitreComponent } from './facture-titre.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: FacturePages.choixClient.urlSegment,
                pathMatch: 'full',
            },
            {
                /**
                 * Page titre
                 */
                path: FacturePages.choixClient.urlSegment,
                data: {
                    pageDef: FacturePages.choixClient,
                    estEnfantPathVide: true
                },
                component: FactureTitreComponent,
                children: [
                    {
                        /**
                         * Page de choix du client pour lequel on veut créer un document de synthèse.
                         * Table de tous les clients avec leurs nombres de bons à synthétiser et des liens vers ./client/:key.
                         */
                        path: '',
                        component: FactureClientsComponent,
                        resolve: {
                            clfDocs: FactureClientsResolverService,
                        },
                    }
                ]
            },
            {
                /**
                 * Page titre contenant toutes les pages d'édition d'une synthèse d'un client.
                 */
                path: FacturePages.client.urlSegment + '/:' + CLFPages.nomParamKeyClient,
                data: {
                    pageDef: FacturePages.client,
                    cheminDeTitre: ['clfDocs', 'client', 'nom'],
                    pageDefDescendantParDéfaut: FacturePages.bons,
                },
                component: FactureClientComponent,
                canActivate: [
                    // Bloque la route tant que le stock n'est pas chargé
                    // Fixe le stock avec les bons à synthétiser du client
                    FactureAttenteBonsGardeService,
                ],
                resolve: {
                    // Fixe le stock avec les bons à synthétiser du client
                    clfDocs: FactureBonsResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: FacturePages.bons.urlSegment,
                        pathMatch: 'full',
                    },
                    {
                        /**
                         * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
                         * Table des bons du client avec leur état de préparation, lien vers ./bon/:no et case de sélection.
                         * Bouton: Créer synthèse.
                         */
                        path: FacturePages.bons.urlSegment,
                        data: {
                            pageDef: FacturePages.bons,
                            estEnfantPathVide: true
                        },
                        component: FactureBonsComponent,
                        resolve: {
                            clfDocs: FactureBonsResolverService,
                        },
                    },
                    {
                        path: FacturePages.envoi.urlSegment,
                        data: { pageDef: FacturePages.envoi },
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
                        path: FacturePages.bon.urlSegment + '/:' + CLFPages.nomParamNoDoc,
                        data: {
                            pageDef: FacturePages.bon,
                            pageDefDescendantParDéfaut: FacturePages.lignes
                        },
                        resolve: {
                            // pour que les gardes des enfants aient accès au résolu de la route
                            // Lit le stock. Crée le cflDoc.
                            clfDoc: FactureBonResolverService,
                        },
                        children: [
                            {
                                path: '',
                                redirectTo: FacturePages.lignes.urlSegment,
                                pathMatch: 'full',
                            },
                            {
                                path: FacturePages.lignes.urlSegment,
                                data: {
                                    pageDef: FacturePages.lignes,
                                    estEnfantPathVide: true
                                },
                                component: FactureBonLignesComponent,
                                canActivate: [
                                    // Lit le stock.
                                    // Redirige vers ./nouveau si noDoc = 0 et la commande virtuelle n'existe pas ou est envoyée
                                    FactureBonExisteGardeService,
                                ],
                                resolve: {
                                    clfDoc: FactureBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.nouveau.urlSegment,
                                data: { pageDef: FacturePages.nouveau },
                                component: FactureBonNouveauComponent,
                                canActivate: [
                                    // Lit le stock.
                                    // Redirige vers ./lignes si noDoc = 0 et la commande virtuelle existe et est ouverte
                                    // ou si noDoc > 0.
                                    // commandeEstVirtuelleEtNExistePasOuEstEnvoyée
                                    FactureDoitCréerGardeService,
                                ],
                                resolve: {
                                    // Lit le stock. Crée le cflDoc.
                                    clfDoc: FactureBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.annule.urlSegment,
                                data: { pageDef: FacturePages.annule },
                                component: FactureBonSupprimeComponent,
                                canActivate: [
                                    // Redirige vers ./nouveau si noDoc = 0 et la commande virtuelle n'existe pas ou est envoyée
                                    // Redirige vers ./lignes si noDoc != 0
                                    // commandeEstVirtuelleEtExisteEtEstOuverte
                                    FactureBonVirtuelGardeService
                                ],
                                resolve: {
                                    clfDoc: FactureBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.choixProduit.urlSegment,
                                data: { pageDef: FacturePages.choixProduit },
                                component: FactureChoixProduitComponent,
                                canActivate: [
                                    FactureBonVirtuelGardeService
                                ],
                                resolve: {
                                    clfDoc: FactureBonResolverService,
                                },
                            },
                            {
                                path: FacturePages.ajoute.urlSegment + '/:' + CLFPages.nomParamNoLigne,
                                data: {
                                    pageDef: FacturePages.ajoute,
                                    cheminDeKey: ['clfLigne', 'produit', 'nom']
                                },
                                component: FactureLigneAjouteComponent,
                                canActivate: [
                                    FactureBonVirtuelGardeService,
                                    FactureProduitPasDansBonGardeService
                                ],
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
