import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { CDocumentRoutingModule } from './c-document-routing.module';
import { CDocumentLivraisonResolverService } from './c-document-livraison-resolver.service';
import { CDocumentCommandeResolverService } from './c-document-commande-resolver.service';
import { CDocumentFactureResolverService } from './c-document-facture-resolver.service';
import { CDocumentDocumentsComponent } from './c-document-documents.component';
import { CDocumentCommandeComponent } from './c-document-commande.component';
import { CDocumentLivraisonComponent } from './c-document-livraison.component';
import { CDocumentFactureComponent } from './c-document-facture.component';
import { CDocumentDocumentsResolverService } from './c-document-documents-resolver.service';
import { CDocumentTitreComponent } from './c-document-titre.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        CDocumentRoutingModule,
    ],
    declarations: [
        CDocumentTitreComponent,
        CDocumentDocumentsComponent,
        CDocumentCommandeComponent,
        CDocumentLivraisonComponent,
        CDocumentFactureComponent,
    ],
    providers: [
        CDocumentDocumentsResolverService,
        CDocumentCommandeResolverService,
        CDocumentLivraisonResolverService,
        CDocumentFactureResolverService,
    ]
})
export class CDocumentModule { }
