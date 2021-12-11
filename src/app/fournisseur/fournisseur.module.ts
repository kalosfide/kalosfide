import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FAccueilComponent } from './f-accueil.component';
import { ErreursModule } from '../erreurs/erreurs.module';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';
import { LFClientsResolverService } from './l-f-clients-resolver.service';
import { LFBonsResolverService } from './l-f-bons-resolver.service';
import { LFBonResolverService } from './l-f-bon-resolver.service';
import { LFEnvoiGardeService } from './l-f-envoi-garde.service';
import { LFAttenteBonsGardeService } from './l-f-attente-bons-garde.service';
import { LFEnfantsDeBonGardeService } from './l-f-enfants-de-bon-garde.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        FournisseurRoutingModule
    ],
    declarations: [
        FAccueilComponent,
    ],
    providers: [
        FournisseurCLFService,
        LFClientsResolverService,
        LFBonsResolverService,
        LFBonResolverService,
        LFAttenteBonsGardeService,
        LFEnvoiGardeService,
        LFEnfantsDeBonGardeService,
    ],
})
export class FournisseurModule { }
