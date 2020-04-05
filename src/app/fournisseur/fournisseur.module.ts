import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FournisseurService } from './fournisseur.service';
import { FAccueilComponent } from './f-accueil.component';
import { MessagesModule } from '../messages/messages.module';
import { ModelesModule } from '../modeles/modeles.module';
import { FSiteModule } from './f-site/f-site.module';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        FSiteModule,
        FournisseurRoutingModule
    ],
    declarations: [
        FAccueilComponent,
    ],
    providers: [
        FournisseurService,
        FournisseurCLFService,
    ],
})
export class FournisseurModule { }
