import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';

import { DispositionModule } from '../disposition/disposition.module';
import { SiteRoutingModule } from './site-routing.module';
import { CompteModule } from '../compte/compte.module';
import { ErreursModule } from '../erreurs/erreurs.module';
import { FournisseurRacineComponent } from './fournisseur-racine.component';
import { ClientRacineComponent } from './client-racine.component';
import { FournisseurGardeService } from './fournisseur-garde.service';
import { ClientGardeService } from './client-garde.service';
import { UsagerGardeService } from './usager-garde.service';
import { SiteResolverService } from './site-resolver.service';
import { SiteOuvertGardeService } from './site-ouvert-garde.service';

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
        UsagerGardeService,
        SiteResolverService,
        FournisseurGardeService,
        ClientGardeService,
        SiteOuvertGardeService
    ],
})
export class SiteModule { }
