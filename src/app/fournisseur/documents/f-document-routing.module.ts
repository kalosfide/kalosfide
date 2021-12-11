import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FDocumentPages } from './f-document-pages';
import { FDocumentCommandeComponent } from './f-document-commande.component';
import { FDocumentLivraisonComponent } from './f-document-livraison.component';
import { FDocumentFactureComponent } from './f-document-facture.component';
import { FDocumentTitreComponent } from './f-document-titre.component';
import { FDocumentClientsComponent } from './f-document-clients.component';
import { FDocumentClientsResolverService } from './f-document-clients-resolver.service';
import { NomParam } from 'src/app/modeles/nom-param';
import { FDocumentDocumentsComponent } from './f-document-documents.component';
import { FDocumentClientTitreComponent } from './f-document-client-titre.component';
import { FDocumentClientResolverService } from './f-document-client-resolver.service';
import { FDocumentDocumentsResolverService } from './f-document-documents-resolver.service';
import { FDocumentClientGardeService } from './f-document-client-garde.service';
import { FDocumentChercheComponent } from './f-document-cherche.component';
import { FDocumentDocumentResolverService } from './f-document-document-resolver.service';

// document
//      client
//          bilan FDocumentClientsComponent
//          :keyClient FDocumentClientTitreComponent
const routes: Routes = [
    {
        path: '',
        component: FDocumentTitreComponent,
        children: [
            {
                path: '',
                redirectTo: FDocumentPages.clients.path,
                pathMatch: 'full',
            },
            {
                // route:
                path: FDocumentPages.clients.path,
                data: {
                    pageDef: FDocumentPages.clients,
                    estEnfantPathVide: true
                },
                children: [
                    {
                        path: '',
                        component: FDocumentClientsComponent,
                        resolve: {
                            clientsBilanDocs: FDocumentClientsResolverService,
                        },
                    },
                    {
                        path: FDocumentPages.client.path + '/:' + NomParam.keyClient,
                        component: FDocumentClientTitreComponent,
                        canActivate: [
                            FDocumentClientGardeService
                        ],
                        resolve: {
                            client: FDocumentClientResolverService,
                        },
                        children: [
                            {
                                path: '',
                                redirectTo: FDocumentPages.liste.path,
                                pathMatch: 'full',
                            },
                            {
                                path: FDocumentPages.liste.path,
                                component: FDocumentDocumentsComponent,
                                resolve: {
                                    clfDocs: FDocumentDocumentsResolverService
                                }
                            },
                            {
                                path: FDocumentPages.commande.path + '/:' + NomParam.noDoc,
                                data: {
                                    typeCLF: 'commande',
                                    pageDef: FDocumentPages.commande,
                                 },
                                component: FDocumentCommandeComponent,
                                resolve: {
                                    clfDoc: FDocumentDocumentResolverService,
                                },
                            },
                            {
                                path: FDocumentPages.livraison.path + '/:' + NomParam.noDoc,
                                data: {
                                    typeCLF: 'livraison',
                                    pageDef: FDocumentPages.livraison,
                                },
                                component: FDocumentLivraisonComponent,
                                resolve: {
                                    clfDoc: FDocumentDocumentResolverService,
                                },
                            },
                            {
                                path: FDocumentPages.facture.path + '/:' + NomParam.noDoc,
                                data: {
                                    typeCLF: 'facture',
                                    pageDef: FDocumentPages.facture
                                },
                                component: FDocumentFactureComponent,
                                resolve: {
                                    clfDoc: FDocumentDocumentResolverService,
                                },
                            },
                        ]
                    },
                ],
            },
            {
                path: FDocumentPages.cherche.path,
                data: { pageDef: FDocumentPages.cherche },
                component: FDocumentChercheComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FDocumentRoutingModule { }
