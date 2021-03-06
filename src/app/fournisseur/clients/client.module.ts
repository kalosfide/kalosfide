import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';

import { ModelesModule } from 'src/app/modeles/modeles.module';
import { ClientIndexComponent } from './client-index.component';
import { ClientAjouteComponent } from './client-ajoute.component';
import { ClientEditeComponent } from './client-edite.component';
import { ClientResolverService } from '../../modeles/client/client-resolver.service';
import { ClientsResolverService } from '../../modeles/client/clients-resolver.service';
import { ClientRoutingModule } from './client-routing.module';
import { ClientAccepteComponent } from './client-accepte.component';
import { ClientExclutComponent } from './client-exclut.component';
import { ClientComponent } from './client.component';
import { ClientInviteComponent } from './client-invite.component';
import { FClientAccueilComponent } from './client-accueil.component';
import { ClientInvitationsComponent } from './client-invitations.component';
import { ClientInviteParentResolverService } from './client-invite-parent-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ModelesModule,
        ClientRoutingModule,
    ],
    declarations: [
        ClientComponent,
        FClientAccueilComponent,
        ClientIndexComponent,
        ClientAjouteComponent,
        ClientEditeComponent,
        ClientAccepteComponent,
        ClientExclutComponent,
        ClientInviteComponent,
        ClientInvitationsComponent,
    ],
    providers: [
        ClientResolverService,
        ClientsResolverService,
        ClientInviteParentResolverService,
    ],
})
export class ClientModule { }
