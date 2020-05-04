import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { AppSiteComponent } from './app-site.component';
import { AppSiteIndexComponent } from './app-site-index.component';
import { AppSiteSitesComponent } from './app-site-sites.component';
import { AppSiteContactComponent } from './app-site-contact.component';
import { AppSiteAProposComponent } from './app-site-a-propos.component';
import { SitesResolverService } from './app-site-sites-resolver.service';
import { AppSiteRoutingModule } from './app-site.routing.module';
import { MessagesModule } from '../messages/messages.module';
import { DevenirFournisseurComponent } from './devenir-fournisseur/devenir-fournisseur.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PeupleService } from './peuple.service';
import { PeupleResolverService } from './peuple-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        CommunModule,
        DispositionModule,
        MessagesModule,
        AppSiteRoutingModule,
    ],
    declarations: [
        AppSiteComponent,
        AppSiteIndexComponent,
        AppSiteSitesComponent,
        AppSiteContactComponent,
        AppSiteAProposComponent,
        DevenirFournisseurComponent,
    ],
    providers: [
        SitesResolverService,
        PeupleService,
        PeupleResolverService,
    ],
})
export class AppSiteModule { }
