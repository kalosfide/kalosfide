import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';

import { ProduitRoutingModule } from './produit-routing.module';
import { ProduitIndexComponent } from './produit-index.component';
import { ProduitEditeComponent } from './produit-edite.component';
import { ProduitAjouteComponent } from './produit-ajoute.component';
import { ProduitResolverService } from '../../../modeles/catalogue/produit-resolver.service';
import { ProduitSiteCatalogueGarde } from './produit-site-catalogue-garde';
import { ProduitSitePasCatalogueGarde } from './produit-site-pas-catalogue-garde';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ProduitRoutingModule,
    ],
    declarations: [
        ProduitAjouteComponent,
        ProduitEditeComponent,
        ProduitIndexComponent,
    ],
    providers: [
        ProduitResolverService,
        ProduitSiteCatalogueGarde,
        ProduitSitePasCatalogueGarde,
    ],
})
export class ProduitModule { }
