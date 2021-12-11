import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { SiteService } from './site/site.service';
import { CatalogueModule } from './catalogue/catalogue.module';
import { FournisseurService } from './fournisseur/fournisseur.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CatalogueModule,
    ],
    declarations: [
    ],
    providers: [
        SiteService,
        FournisseurService,
    ],
    exports: [
        CatalogueModule
    ]
})
export class ModelesModule { }
