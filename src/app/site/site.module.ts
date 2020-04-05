import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteResolverService } from './site-resolver.service';
import { CommunModule } from '../commun/commun.module';

import { DispositionModule } from '../disposition/disposition.module';
import { SiteRoutingModule } from './site-routing.module';
import { CompteModule } from '../compte/compte.module';
import { MessagesModule } from '../messages/messages.module';
import { VisiteurRacineComponent } from './visiteur-racine-component';
import { FournisseurRacineComponent } from './fournisseur-racine.component';
import { ClientRacineComponent } from './client-racine.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        MessagesModule,
        CompteModule,
        SiteRoutingModule,
    ],
    declarations: [
        VisiteurRacineComponent,
        FournisseurRacineComponent,
        ClientRacineComponent,
    ],
    providers: [
        SiteResolverService,
    ],
})
export class SiteModule { }
