import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDocumentPages } from './c-document-pages';
import { CDocumentCommandeResolverService } from './c-document-commande-resolver.service';
import { CDocumentLivraisonResolverService } from './c-document-livraison-resolver.service';
import { CDocumentFactureResolverService } from './c-document-facture-resolver.service';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';
import { CDocumentDocumentsComponent } from './c-document-documents.component';
import { CDocumentCommandeComponent } from './c-document-commande.component';
import { CDocumentLivraisonComponent } from './c-document-livraison.component';
import { CDocumentDocumentsResolverService } from './c-document-documents-resolver.service';
import { CDocumentFactureComponent } from './c-document-facture.component';
import { CDocumentTitreComponent } from './c-document-titre.component';

const routes: Routes = [
    {
        path: '',
        component: CDocumentTitreComponent,
        children: [
            {
                path: '',
                redirectTo: CDocumentPages.liste.urlSegment,
                pathMatch: 'full',
            },
            {
                path: CDocumentPages.liste.urlSegment,
                data: {
                    pageDef: CDocumentPages.liste,
                    estEnfantPathVide: true
                },
                component: CDocumentDocumentsComponent,
                resolve: {
                    liste: CDocumentDocumentsResolverService,
                },
            },
            {
                path: CDocumentPages.commande.urlSegment + '/:' + CLFPages.nomParamNoDoc,
                data: { pageDef: CDocumentPages.commande },
                component: CDocumentCommandeComponent,
                resolve: {
                    clfDoc: CDocumentCommandeResolverService,
                },
            },
            {
                path: CDocumentPages.livraison.urlSegment + '/:' + CLFPages.nomParamNoDoc,
                data: { pageDef: CDocumentPages.livraison },
                component: CDocumentLivraisonComponent,
                resolve: {
                    clfDoc: CDocumentLivraisonResolverService,
                },
            },
            {
                path: CDocumentPages.facture.urlSegment + '/:' + CLFPages.nomParamNoDoc,
                data: { pageDef: CDocumentPages.facture },
                component: CDocumentFactureComponent,
                resolve: {
                    clfDoc: CDocumentFactureResolverService,
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
