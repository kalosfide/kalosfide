import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { CommunModule } from './commun/commun.module';
import { ApiConfigService } from './services/api-config.service';
import { IdentificationService } from './securite/identification.service';
import { DispositionModule } from './disposition/disposition.module';
import { MotDePasseService } from './securite/mot-de-passe/mot-de-passe.service';
import { httpInterceptorProviders } from './services/http-interceptor-provider';
import { NavigationService } from './services/navigation.service';
import { FournisseurGarde } from './securite/fournisseur-garde';
import { MotDePasseResolverService } from './securite/mot-de-passe/mot-de-passe-resolver.service';
import { ModelesModule } from './modeles/modeles.module';
import { MessagesModule } from './messages/messages.module';
import { AlerteService } from './disposition/alerte/alerte-service';
import { ClientGarde } from './securite/client-garde';
import { IdentifiantResolverService } from './securite/identifiant-resolver.service';
import { CatalogueService } from './modeles/catalogue/catalogue.service';
import { ApiRequêteService } from './services/api-requete.service';
import { RetourneVraiResolverService } from './services/retourne-vrai-resolver.service';
import { EtatSiteChangeGarde, SiteOuvertGarde } from './securite/site-ouvert-garde';
import { StockageService } from './services/stockage/stockage.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,

        CommunModule,
        DispositionModule,
        MessagesModule,
        ModelesModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        StockageService,
        Title,
        ApiConfigService,
        NavigationService,
        IdentificationService,
        httpInterceptorProviders,
        NgbActiveModal,
        AlerteService,

        ApiRequêteService,

        MotDePasseService,
        MotDePasseResolverService,
        IdentifiantResolverService,

        FournisseurGarde,
        ClientGarde,
        EtatSiteChangeGarde,
        SiteOuvertGarde,

        CatalogueService,

        RetourneVraiResolverService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
