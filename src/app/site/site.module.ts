import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';

import { DispositionModule } from '../disposition/disposition.module';
import { SiteRoutingModule } from './site-routing.module';
import { CompteModule } from '../compte/compte.module';
import { ErreursModule } from '../erreurs/erreurs.module';
import { FournisseurRacineComponent } from './fournisseur-racine.component';
import { ClientRacineComponent } from './client-racine.component';
import { FournisseurGarde } from './fournisseur-garde';
import { ClientGarde } from './client-garde';
import { UsagerGarde } from './usager-garde';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        CompteModule,
        SiteRoutingModule,
    ],
    declarations: [
        FournisseurRacineComponent,
        ClientRacineComponent,
    ],
    providers: [
        UsagerGarde,
        FournisseurGarde,
        ClientGarde,
    ],
})
export class SiteModule { }
