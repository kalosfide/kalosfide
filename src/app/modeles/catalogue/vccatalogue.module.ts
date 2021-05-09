import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../../commun/commun.module';
import { DispositionModule } from '../../disposition/disposition.module';
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
