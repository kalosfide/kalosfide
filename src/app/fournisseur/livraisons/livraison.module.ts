import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { LivraisonRoutingModule } from './livraison-routing.module';

import { LivraisonBonsComponent } from './livraison-bons.component';

import { LivraisonClientComponent } from './livraison-client.component';
import { LivraisonBonLignesComponent } from './livraison-bon-lignes.component';

import { LivraisonClientsResolverService } from './livraison-clients-resolver.service';

import { LivraisonChoixProduitComponent } from './livraison-choix-produit.component';
import { LivraisonClientsComponent } from './livraison-clients.component';
import { LivraisonLigneAjouteComponent } from './livraison-ligne-ajoute.component';
import { LivraisonLigneSupprimeComponent } from './livraison-ligne-supprime.component';
import { LivraisonBonSupprimeComponent } from './livraison-bon-supprime.component';
import { LivraisonBonsResolverService } from './livraison-bons-resolver.service';
import { LivraisonBonResolverService } from './livraison-bon-resolver.service';
import { LivraisonBonVirtuelGardeService } from './livraison-bon-virtuel-garde.service';
import { LivraisonLigneResolverService } from './livraison-ligne-resolver.service';
import { LivraisonEnvoiComponent } from './livraison-envoi.component';
import { LivraisonSynthèseResolverService } from './livraison-synthese-resolver.service';
import { LivraisonBonExisteGardeService } from './livraison-bon-existe-garde.service';
import { LivraisonDoitCréerGardeService } from './livraison-doit-creer-garde.service';
import { LivraisonAttenteBonsGardeService } from './livraison-attente-bons-garde.service';
import { LivraisonBonNouveauComponent } from './livraison-bon-nouveau.component';
import { LivraisonEnvoiGardeService } from './livraison-envoi-garde.service';
import { LivraisonProduitPasDansBonGardeService } from './livraison-produit-pas-dans-bon-garde.service';
import { LivraisonTitreComponent } from './livraison-titre.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        LivraisonRoutingModule
    ],
    declarations: [
        LivraisonClientComponent,
        LivraisonClientsComponent,

        LivraisonBonsComponent,
        LivraisonBonLignesComponent,
        LivraisonBonNouveauComponent,
        LivraisonBonSupprimeComponent,
        LivraisonChoixProduitComponent,
        LivraisonTitreComponent,
        LivraisonClientsComponent,
        LivraisonLigneAjouteComponent,
        LivraisonLigneSupprimeComponent,
        LivraisonEnvoiComponent,
    ],
    providers: [
        LivraisonClientsResolverService,
        LivraisonAttenteBonsGardeService,
        LivraisonBonsResolverService,
        LivraisonBonResolverService,
        LivraisonBonExisteGardeService,
        LivraisonDoitCréerGardeService,
        LivraisonBonVirtuelGardeService,
        LivraisonEnvoiGardeService,
        LivraisonLigneResolverService,
        LivraisonSynthèseResolverService,
        LivraisonProduitPasDansBonGardeService,
    ]
})
export class LivraisonModule { }
