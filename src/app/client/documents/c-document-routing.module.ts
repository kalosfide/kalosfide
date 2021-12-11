import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDocumentPages } from './c-document-pages';
import { CDocumentDocumentsComponent } from './c-document-documents.component';
import { CDocumentCommandeComponent } from './c-document-commande.component';
import { CDocumentLivraisonComponent } from './c-document-livraison.component';
import { CDocumentDocumentsResolverService } from './c-document-documents-resolver.service';
import { CDocumentFactureComponent } from './c-document-facture.component';
import { CDocumentTitreComponent } from './c-document-titre.component';
import { NomParam } from 'src/app/modeles/nom-param';
import { CDocumentResolverService } from './c-document-document-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: CDocumentTitreComponent,
        children: [
            {
                path: '',
                redirectTo: CDocumentPages.liste.path,
                pathMatch: 'full',
            },
            {
                path: CDocumentPages.liste.path,
                data: {
                    pageDef: CDocumentPages.liste,
                    estEnfantPathVide: true
                },
                component: CDocumentDocumentsComponent,
                resolve: {
                    clfDocs: CDocumentDocumentsResolverService,
                },
            },
            {
                path: CDocumentPages.commande.path + '/:' + NomParam.noDoc,
                data: {
                    typeCLF: 'commande',
                    pageDef: CDocumentPages.commande
                },
                component: CDocumentCommandeComponent,
                resolve: {
                    clfDoc: CDocumentResolverService,
                },
            },
            {
                path: CDocumentPages.livraison.path + '/:' + NomParam.noDoc,
                data: {
                    typeCLF: 'livraison',
                    pageDef: CDocumentPages.livraison
                },
                component: CDocumentLivraisonComponent,
                resolve: {
                    clfDoc: CDocumentResolverService,
                },
            },
            {
                path: CDocumentPages.facture.path + '/:' + NomParam.noDoc,
                data: {
                    typeCLF: 'facture',
                    pageDef: CDocumentPages.facture,
                },
                component: CDocumentFactureComponent,
                resolve: {
                    clfDoc: CDocumentResolverService,
                },
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CDocumentRoutingModule { }
