import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { ErreursModule } from 'src/app/erreurs/erreurs.module';
import { FactureRoutingModule } from './facture-routing.module';
import { FactureClientComponent } from './facture-client.component';
import { FactureClientsComponent } from './facture-clients.component';
import { FactureBonsComponent } from './facture-bons.component';
import { FactureBonLignesComponent } from './facture-bon-lignes.component';
import { FactureBonNouveauComponent } from './facture-bon-nouveau.component';
import { FactureBonSupprimeComponent } from './facture-bon-supprime.component';
import { FactureChoixProduitComponent } from './facture-choix-produit.component';
import { FactureLigneAjouteComponent } from './facture-ligne-ajoute.component';
import { FactureEnvoiComponent } from './facture-envoi.component';
import { FactureLigneResolverService } from './facture-ligne-resolver.service';
import { FactureSynthèseResolverService } from './facture-synthese-resolver.service';
import { FactureTitreComponent } from './facture-titre.component';
import { FactureEnvoiGardeService } from './facture-envoi-garde.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        FactureRoutingModule
    ],
    declarations: [
        FactureClientComponent,
        FactureClientsComponent,

        FactureBonsComponent,
        FactureBonLignesComponent,
        FactureBonNouveauComponent,
        FactureBonSupprimeComponent,
        FactureChoixProduitComponent,
        FactureClientsComponent,
        FactureLigneAjouteComponent,
        FactureEnvoiComponent,
        FactureTitreComponent,
    ],
    providers: [
        FactureLigneResolverService,
        FactureSynthèseResolverService,
        FactureEnvoiGardeService
    ]
})
export class FactureModule { }
