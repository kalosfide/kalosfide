import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { CompteRoutingModule } from './compte-routing.module';

import { ConnectionComponent } from './connection/connection.component';
import { DeconnectionComponent } from './deconnection/deconnection.component';
import { CompteService } from './compte.service';
import { DispositionModule } from '../disposition/disposition.module';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CompteRoutingModule,
    ],
    declarations: [
        ConnectionComponent,
        DeconnectionComponent,
    ],
    providers: [
        CompteService,
    ],
})
export class CompteModule { }
