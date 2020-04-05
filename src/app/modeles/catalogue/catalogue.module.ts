import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../../commun/commun.module';
import { DispositionModule } from '../../disposition/disposition.module';
import { ProduitService } from './produit.service';
import { CategorieService } from './categorie.service';
import { CatalogueResolverService, CatalogueRésoluResolverService } from './catalogue-resolver.service';
import { CatalogueService } from './catalogue.service';
import { CategoriesResolverService } from './categories-resolver.service';
import { ProduitRésoluResolverService, ProduitResolverService } from './produit-resolver.service';
import { CategorieResolverService } from './categorie-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
    ],
    declarations: [
    ],
    providers: [
//        CatalogueService,
        CategorieService,
        ProduitService,
        CatalogueResolverService,
        CatalogueRésoluResolverService,
        CategorieResolverService,
        CategoriesResolverService,
        ProduitResolverService,
        ProduitRésoluResolverService,
    ],
})
export class CatalogueModule { }
