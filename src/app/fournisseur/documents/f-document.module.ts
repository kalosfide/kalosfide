import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { ErreursModule } from 'src/app/erreurs/erreurs.module';
import { FDocumentRoutingModule } from './f-document-routing.module';
import { FDocumentCommandeResolverService } from './f-document-commande-resolver.service';
import { FDocumentLivraisonResolverService } from './f-document-livraison-resolver.service';
import { FDocumentFactureResolverService } from './f-document-facture-resolver.service';
import { FDocumentDocumentsResolverService } from './f-document-documents-resolver.service';
import { FDocumentDocumentsComponent } from './f-document-documents.component';
import { FDocumentCommandeComponent } from './f-document-commande.component';
import { FDocumentLivraisonComponent } from './f-document-livraison.component';
import { FDocumentFactureComponent } from './f-document-facture.component';
import { FDocumentTitreComponent } from './f-document-titre.component';

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
        FDocumentDocumentsComponent,
        FDocumentCommandeComponent,
        FDocumentLivraisonComponent,
        FDocumentFactureComponent,
    ],
    providers: [
        FDocumentDocumentsResolverService,
        FDocumentCommandeResolverService,
        FDocumentLivraisonResolverService,
        FDocumentFactureResolverService,
    ]
})
export class FDocumentModule { }
