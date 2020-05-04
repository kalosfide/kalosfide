import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { FactureRoutingModule } from './facture-routing.module';
import { FactureClientComponent } from './facture-client.component';
import { FactureClientsComponent } from './facture-clients.component';
import { FactureBonsComponent } from './facture-bons.component';
import { FactureBonLignesComponent } from './facture-bon-lignes.component';
import { FactureBonNouveauComponent } from './facture-bon-nouveau.component';
import { FactureBonSupprimeComponent } from './facture-bon-supprime.component';
import { FactureChoixProduitComponent } from './facture-choix-produit.component';
import { FactureLigneAjouteComponent } from './facture-ligne-ajoute.component';
import { FactureLigneSupprimeComponent } from './facture-ligne-supprime.component';
import { FactureEnvoiComponent } from './facture-envoi.component';
import { FactureClientsResolverService } from './facture-clients-resolver.service';
import { FactureAttenteBonsGardeService } from './facture-attente-bons-garde.service';
import { FactureBonsResolverService } from './facture-bons-resolver.service';
import { FactureBonResolverService } from './facture-bon-resolver.service';
import { FactureBonExisteGardeService } from './facture-bon-existe-garde.service';
import { FactureDoitCréerGardeService } from './facture-doit-creer-garde.service';
import { FactureBonVirtuelGardeService } from './facture-bon-virtuel-garde.service';
import { FactureEnvoiGardeService } from './facture-envoi-garde.service';
import { FactureLigneResolverService } from './facture-ligne-resolver.service';
import { FactureSynthèseResolverService } from './facture-synthese-resolver.service';
import { FactureProduitPasDansBonGardeService } from './facture-produit-pas-dans-bon-garde.service';
import { FactureTitreComponent } from './facture-titre.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        MessagesModule,
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
        FactureLigneSupprimeComponent,
        FactureEnvoiComponent,
        FactureTitreComponent,
    ],
    providers: [
        FactureClientsResolverService,
        FactureAttenteBonsGardeService,
        FactureBonsResolverService,
        FactureBonResolverService,
        FactureBonExisteGardeService,
        FactureDoitCréerGardeService,
        FactureBonVirtuelGardeService,
        FactureEnvoiGardeService,
        FactureLigneResolverService,
        FactureSynthèseResolverService,
        FactureProduitPasDansBonGardeService,
    ]
})
export class FactureModule { }
