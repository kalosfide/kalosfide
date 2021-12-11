import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { CommunModule } from './commun/commun.module';
import { ApiConfigService } from './api/api-config.service';
import { IdentificationService } from './securite/identification.service';
import { DispositionModule } from './disposition/disposition.module';
import { httpInterceptorProviders } from './services/http-interceptor-provider';
import { NavigationService } from './services/navigation.service';
import { ErreursModule } from './erreurs/erreurs.module';
import { AlerteService } from './disposition/alerte/alerte-service';
import { CatalogueService } from './modeles/catalogue/catalogue.service';
import { ApiRequêteService } from './api/api-requete.service';
import { RetourneVraiResolverService } from './services/retourne-vrai-resolver.service';
import { StockageService } from './services/stockage/stockage.service';
import { IdentifiantGardeService } from './securite/identifant-garde.service';
import { RouteurService } from './services/routeur.service';
import { ClientService } from './modeles/client/client.service';
import { TraiteKeydownService } from './commun/traite-keydown/traite-keydown.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,

        CommunModule,
        DispositionModule,
        ErreursModule,
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
        IdentifiantGardeService,
        httpInterceptorProviders,
        RouteurService,
        NgbActiveModal,
        AlerteService,
        TraiteKeydownService,

        ApiRequêteService,

        CatalogueService,
        ClientService,

        RetourneVraiResolverService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
