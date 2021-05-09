import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { SiteService } from './site/site.service';
import { ClientService } from './client/client.service';
import { ClientResolverService, ClientRésoluResolverService } from './client/client-resolver.service';
import { ClientsResolverService, ClientsRésoluResolverService } from './client/clients-resolver.service';
import { CatalogueModule } from './catalogue/catalogue.module';
import { InvitationService } from './invitation/invitation.service';
import { InvitationsResolverService } from './invitation/invitations-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CatalogueModule,
    ],
    declarations: [
    ],
    providers: [
        SiteService,
//        ClientService,
        ClientResolverService,
        ClientRésoluResolverService,
        ClientsResolverService,
        ClientsRésoluResolverService,
        InvitationService,
        InvitationsResolverService
    ],
    exports: [
        CatalogueModule
    ]
})
export class ModelesModule { }
