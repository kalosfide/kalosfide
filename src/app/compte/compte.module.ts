import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { CompteRoutingModule } from './compte-routing.module';

import { ConnectionComponent } from './connection/connection.component';
import { DeconnectionComponent } from './deconnection/deconnection.component';
import { CompteService } from './compte.service';
import { DispositionModule } from '../disposition/disposition.module';
import { AjouteComponent } from './ajoute/ajoute.component';
import { ConfirmeEmailComponent } from './confirme-email/confirme-email.component';
import { OubliMotDePasseComponent } from './oubli-mot-de-passe/oubli-mot-de-passe.component';
import { RéinitialiseMotDePasseComponent } from './réinitialise-mot-de-passe/réinitialise-mot-de-passe.component';
import { QueryParamIdCodeResolverService } from './query-param-id-code-resolver.service';
import { ChangeMotDePasseComponent } from './change-mot-de-passe/change-mot-de-passe.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ConfirmeChangeEmailComponent } from './confirme-email/confirme-change-email.component';
import { QueryParamEmailPossibleResolverService } from './query-param-email-possible-resolver.service';
import { QueryParamEmailRequisResolverService } from './query-param-email-requis-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CompteRoutingModule,
    ],
    declarations: [
        AjouteComponent,
        ConfirmeEmailComponent,
        ConnectionComponent,
        DeconnectionComponent,
        OubliMotDePasseComponent,
        RéinitialiseMotDePasseComponent,
        ChangeMotDePasseComponent,
        ChangeEmailComponent,
        ConfirmeChangeEmailComponent,
    ],
    providers: [
        CompteService,
        QueryParamIdCodeResolverService,
        QueryParamEmailPossibleResolverService,
        QueryParamEmailRequisResolverService,
    ],
})
export class CompteModule { }
