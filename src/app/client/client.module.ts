import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { ClientRoutingModule } from './client-routing.module';
import { CAccueilComponent } from './c-accueil.component';
import { ErreursModule } from '../erreurs/erreurs.module';
import { CProduitsComponent } from './c-produits.component';
import { ClientCLFService } from './client-c-l-f.service';
import { SiteOuvertGardeService } from './site-ouvert-garde.service';
import { SitePasOuvertGardeService } from './site-pas-ouvert-garde.service';
import { SitePasOuvertComponent } from './site-pas-ouvert.component';
import { ContexteCatalogueResolverService } from './contexte-catalogue-resolver.service';
import { LitEtatSiteEtLaissePasserGardeService } from './lit-etat-site-et-laisse-passer-garde.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        ClientRoutingModule,
    ],
    declarations: [
        CAccueilComponent,
        CProduitsComponent,
        SitePasOuvertComponent,
    ],
    providers: [
        ClientCLFService,
        LitEtatSiteEtLaissePasserGardeService,
        SiteOuvertGardeService,
        SitePasOuvertGardeService,
        ContexteCatalogueResolverService,

    ]
})
export class ClientModule { }
