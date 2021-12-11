import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { ErreursModule } from 'src/app/erreurs/erreurs.module';
import { LivraisonRoutingModule } from './livraison-routing.module';

import { LivraisonBonsComponent } from './livraison-bons.component';

import { LivraisonClientComponent } from './livraison-client.component';
import { LivraisonBonLignesComponent } from './livraison-bon-lignes.component';

import { LivraisonChoixProduitComponent } from './livraison-choix-produit.component';
import { LivraisonClientsComponent } from './livraison-clients.component';
import { LivraisonLigneAjouteComponent } from './livraison-ligne-ajoute.component';
import { LivraisonLigneResolverService } from './livraison-ligne-resolver.service';
import { LivraisonEnvoiComponent } from './livraison-envoi.component';
import { LivraisonSynthèseResolverService } from './livraison-synthese-resolver.service';
import { LivraisonBonNouveauComponent } from './livraison-bon-nouveau.component';
import { LivraisonTitreComponent } from './livraison-titre.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        LivraisonRoutingModule
    ],
    declarations: [
        LivraisonClientComponent,
        LivraisonClientsComponent,

        LivraisonBonsComponent,
        LivraisonBonLignesComponent,
        LivraisonBonNouveauComponent,
        LivraisonChoixProduitComponent,
        LivraisonTitreComponent,
        LivraisonClientsComponent,
        LivraisonLigneAjouteComponent,
        LivraisonEnvoiComponent,
    ],
    providers: [
        LivraisonLigneResolverService,
        LivraisonSynthèseResolverService,
    ]
})
export class LivraisonModule { }
