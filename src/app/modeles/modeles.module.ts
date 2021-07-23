import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { SiteService } from './site/site.service';
import { ClientService } from './client/client.service';
import { ClientResolverService } from './client/client-resolver.service';
import { ClientsResolverService } from './client/clients-resolver.service';
import { CatalogueModule } from './catalogue/catalogue.module';
import { InvitationsResolverService } from './client/invitations-resolver.service';
import { InvitationResolverService } from './client/invitation-resolver.service';
import { ClientChargeEtLaissePasserGardeService } from './client/client-charge-et-laisse-passer-garde.service';

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
        ClientChargeEtLaissePasserGardeService,
//        ClientService,
        ClientResolverService,
        ClientsResolverService,
        InvitationsResolverService,
        InvitationResolverService,
    ],
    exports: [
        CatalogueModule
    ]
})
export class ModelesModule { }
