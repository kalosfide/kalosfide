import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../../commun/commun.module';
import { DispositionModule } from '../../disposition/disposition.module';
import { ProduitService } from './produit.service';
import { CategorieService } from './categorie.service';
import { CatalogueResolverService } from './catalogue-resolver.service';
import { CatalogueService } from './catalogue.service';
import { CategoriesResolverService } from './categories-resolver.service';
import { ProduitResolverService } from './produit-resolver.service';
import { CategorieResolverService } from './categorie-resolver.service';
import { ModelesModule } from '../modeles.module';
import { VCCatalogueRoutingModule } from './v-c-catalogue-routing.module';
import { VCModifEnCoursComponent } from './v-c-modif-en-cours.component';
import { VCProduitsComponent } from './v-c-produits.component';
import { VCEtatCatalogueGardeService } from './v-c-etat-catalogue-garde.service';
import { VCEtatOuvertGardeService } from './v-c-etat-ouvert-garde.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ModelesModule,
        VCCatalogueRoutingModule
    ],
    declarations: [
        VCModifEnCoursComponent,
        VCProduitsComponent,
    ],
    providers: [
        VCEtatCatalogueGardeService,
        VCEtatOuvertGardeService,
    ],
})
export class VCCatalogueModule { }
