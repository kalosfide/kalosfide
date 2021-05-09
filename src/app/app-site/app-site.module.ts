import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { AppSiteComponent } from './app-site.component';
import { AppSitePeupleComponent } from './app-site-peuple.component';
import { AppSiteSitesComponent } from './app-site-sites.component';
import { AppSiteContactComponent } from './app-site-contact.component';
import { AppSiteAProposComponent } from './app-site-a-propos.component';
import { AppSiteRoutingModule } from './app-site.routing.module';
import { ErreursModule } from '../erreurs/erreurs.module';
import { DevenirFournisseurComponent } from './devenir-fournisseur/devenir-fournisseur.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PeupleService } from './peuple.service';
import { PeupleResolverService } from './peuple-resolver.service';
import { AppSiteAccueilComponent } from './app-site-accueil.component';
import { DevenirClientComponent } from './devenir-client/devenir-client.component';
import { DevenirClientResolverService } from './devenir-client/devenir-client-resolver.service';

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
        AppSiteSitesComponent,
        AppSiteContactComponent,
        AppSiteAProposComponent,
        DevenirFournisseurComponent,
        DevenirClientComponent,
    ],
    providers: [
        DevenirClientResolverService,
        PeupleService,
        PeupleResolverService,
    ],
})
export class AppSiteModule { }
