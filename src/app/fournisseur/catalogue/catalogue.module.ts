import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';

import { ModelesModule } from 'src/app/modeles/modeles.module';
import { CatalogueComponent } from './catalogue.component';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CatalogueFinitService } from './catalogue-finit.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ModelesModule,
        CatalogueRoutingModule,
    ],
    declarations: [
        CatalogueComponent,
    ],
    providers: [
        CatalogueFinitService,
    ],
})
export class CatalogueModule { }
