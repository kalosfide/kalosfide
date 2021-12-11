import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { ErreursModule } from 'src/app/erreurs/erreurs.module';
import { FDocumentRoutingModule } from './f-document-routing.module';
import { FDocumentDocumentsComponent } from './f-document-documents.component';
import { FDocumentCommandeComponent } from './f-document-commande.component';
import { FDocumentLivraisonComponent } from './f-document-livraison.component';
import { FDocumentFactureComponent } from './f-document-facture.component';
import { FDocumentTitreComponent } from './f-document-titre.component';
import { FDocumentClientsComponent } from './f-document-clients.component';
import { FDocumentClientsResolverService } from './f-document-clients-resolver.service';
import { FDocumentClientTitreComponent } from './f-document-client-titre.component';
import { FDocumentClientGardeService } from './f-document-client-garde.service';
import { FDocumentDocumentsResolverService } from './f-document-documents-resolver.service';
import { FDocumentClientResolverService } from './f-document-client-resolver.service';
import { FDocumentChercheComponent } from './f-document-cherche.component';
import { FDocumentDocumentResolverService } from './f-document-document-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        FDocumentRoutingModule,
    ],
    declarations: [
        FDocumentTitreComponent,
        FDocumentClientsComponent,
        FDocumentClientTitreComponent,
        FDocumentDocumentsComponent,
        FDocumentCommandeComponent,
        FDocumentLivraisonComponent,
        FDocumentFactureComponent,
        FDocumentChercheComponent,
    ],
    providers: [
        FDocumentClientsResolverService,
        FDocumentClientGardeService,
        FDocumentClientResolverService,
        FDocumentDocumentsResolverService,
        FDocumentDocumentResolverService,
    ]
})
export class FDocumentModule { }
