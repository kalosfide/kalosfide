import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { AppSiteComponent } from './app-site.component';
import { AppSitePeupleComponent } from './app-site-peuple.component';
import { AppSiteContactComponent } from './app-site-contact.component';
import { AppSiteAProposComponent } from './app-site-a-propos.component';
import { AppSiteRoutingModule } from './app-site.routing.module';
import { ErreursModule } from '../erreurs/erreurs.module';
import { NouveauSiteComponent } from './nouveau-site/nouveau-site.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PeupleService } from './peuple.service';
import { PeupleResolverService } from './peuple-resolver.service';
import { AppSiteAccueilComponent } from './app-site-accueil.component';
import { DevenirClientComponent } from './devenir-client/devenir-client.component';
import { DevenirClientResolverService } from './devenir-client/devenir-client-resolver.service';
import { IdentifiantResolverService } from './identifiant-resolver.service';
import { IdentifiantRole0GardeService } from './identifiant-role-0-garde.service';
import { NouveauSiteResolverService } from './nouveau-site/nouveau-site-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        AppSiteRoutingModule,
    ],
    declarations: [
        AppSiteComponent,
        AppSiteAccueilComponent,
        AppSitePeupleComponent,
        AppSiteContactComponent,
        AppSiteAProposComponent,
        NouveauSiteComponent,
        DevenirClientComponent,
    ],
    providers: [
        NouveauSiteResolverService,
        DevenirClientResolverService,
        PeupleService,
        PeupleResolverService,
        IdentifiantRole0GardeService,
        IdentifiantResolverService,
    ],
})
export class AppSiteModule { }
