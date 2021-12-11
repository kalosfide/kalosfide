import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { ErreursModule } from 'src/app/erreurs/erreurs.module';
import { CDocumentRoutingModule } from './c-document-routing.module';
import { CDocumentDocumentsComponent } from './c-document-documents.component';
import { CDocumentCommandeComponent } from './c-document-commande.component';
import { CDocumentLivraisonComponent } from './c-document-livraison.component';
import { CDocumentFactureComponent } from './c-document-facture.component';
import { CDocumentDocumentsResolverService } from './c-document-documents-resolver.service';
import { CDocumentTitreComponent } from './c-document-titre.component';
import { CDocumentResolverService } from './c-document-document-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
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
        CDocumentResolverService
    ]
})
export class CDocumentModule { }
