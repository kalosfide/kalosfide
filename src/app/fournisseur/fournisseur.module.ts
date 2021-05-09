import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FAccueilComponent } from './f-accueil.component';
import { ErreursModule } from '../erreurs/erreurs.module';
import { FSiteModule } from './f-site/f-site.module';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        FSiteModule,
        FournisseurRoutingModule
    ],
    declarations: [
        FAccueilComponent,
    ],
    providers: [
        FournisseurCLFService,
    ],
})
export class FournisseurModule { }
