import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { ClientRoutingModule } from './client-routing.module';
import { CAccueilComponent } from './c-accueil.component';
import { ErreursModule } from '../erreurs/erreurs.module';
import { CProduitsComponent } from './c-produits.component';
import { ClientCLFService } from './client-c-l-f.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        ClientRoutingModule,
    ],
    declarations: [
        CAccueilComponent,
        CProduitsComponent,
    ],
    providers: [
        ClientCLFService,
    ]
})
export class ClientModule { }
