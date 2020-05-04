import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FDocumentCommandeResolverService } from './f-document-commande-resolver.service';
import { FDocumentLivraisonResolverService } from './f-document-livraison-resolver.service';
import { FDocumentFactureResolverService } from './f-document-facture-resolver.service';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';
import { FDocumentPages } from './f-document-pages';
import { FDocumentDocumentsResolverService } from './f-document-documents-resolver.service';
import { FDocumentDocumentsComponent } from './f-document-documents.component';
import { FDocumentCommandeComponent } from './f-document-commande.component';
import { FDocumentLivraisonComponent } from './f-document-livraison.component';
import { FDocumentFactureComponent } from './f-document-facture.component';
import { FDocumentTitreComponent } from './f-document-titre.component';

const routes: Routes = [
    {
        path: '',
        component: FDocumentTitreComponent,
        children: [
            {
                path: '',
                redirectTo: FDocumentPages.liste.urlSegment,
                pathMatch: 'full',
            },
            {
                path: FDocumentPages.liste.urlSegment,
                data: {
                    pageDef: FDocumentPages.liste,
                    estEnfantPathVide: true
                },
                component: FDocumentDocumentsComponent,
                resolve: {
                    clfDocs: FDocumentDocumentsResolverService,
                },
            },
            {
                path: FDocumentPages.commande.urlSegment + '/:' + CLFPages.nomParamKeyDoc,
                data: { pageDef: FDocumentPages.commande },
                component: FDocumentCommandeComponent,
                resolve: {
                    clfDoc: FDocumentCommandeResolverService,
                },
            },
            {
                path: FDocumentPages.livraison.urlSegment + '/:' + CLFPages.nomParamKeyDoc,
                data: { pageDef: FDocumentPages.livraison },
                component: FDocumentLivraisonComponent,
                resolve: {
                    clfDoc: FDocumentLivraisonResolverService,
                },
            },
            {
                path: FDocumentPages.facture.urlSegment + '/:' + CLFPages.nomParamKeyDoc,
                data: { pageDef: FDocumentPages.facture },
                component: FDocumentFactureComponent,
                resolve: {
                    clfDoc: FDocumentFactureResolverService,
                },
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FDocumentRoutingModule { }
