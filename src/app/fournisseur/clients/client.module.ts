import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';

import { ModelesModule } from 'src/app/modeles/modeles.module';
import { ClientIndexComponent } from './client-index.component';
import { ClientAjouteComponent } from './client-ajoute.component';
import { ClientEditeComponent } from './client-edite.component';
import { ClientResolverService } from './client-resolver.service';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientInviteComponent } from './client-invite.component';
import { FClientAccueilComponent } from './client-accueil.component';
import { ClientInvitationsComponent } from './client-invitations.component';
import { ClientDéfinitionsComponent } from './client-definitions.component';
import { ClientMéthodesComponent } from './client-methodes.component';
import { ClientsResolverService } from './clients-resolver.service';
import { InvitationsResolverService } from './invitations-resolver.service';
import { InvitationResolverService } from './invitation-resolver.service';
import { ClientChargeEtLaissePasserGardeService } from './client-charge-et-laisse-passer-garde.service';

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
        ClientDéfinitionsComponent,
        ClientMéthodesComponent,
        ClientIndexComponent,
        ClientAjouteComponent,
        ClientEditeComponent,
        ClientInviteComponent,
        ClientInvitationsComponent,
    ],
    providers: [
        ClientsResolverService,
        ClientChargeEtLaissePasserGardeService,
        ClientResolverService,
        InvitationsResolverService,
        InvitationResolverService,
    ],
})
export class ClientModule { }
