import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { CommandeRoutingModule } from './commande-routing.module';
import { CommandeAccueilComponent } from './commande-accueil.component';
import { CommandeChoixProduitComponent } from './commande-choix-produit.component';
import { CommandeProduitResolverService } from './commande-produit-resolver.service';
import { CommandeLigneAjouteComponent } from './commande-ligne-ajoute.component';
import { CommandeBonResolverService } from './commande-bon-resolver.service';
import { CommandeBonComponent } from './commande-bon.component';
import { CommandeAnnuleComponent } from './commande-annule.component';
import { CommandeEnvoiGardeService } from './commande-envoi-garde.service';
import { CommandeNouveauComponent } from './commande-nouveau.component';
import { CommandeLigneResolverService } from './commande-ligne-resolver.service';
import { CommandeEnvoiComponent } from './commande-envoi.component';
import { CEnfantsDeBonGardeService } from './c-enfants-de-bon-garde.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CommandeRoutingModule,
    ],
    declarations: [
        CommandeAccueilComponent,
        CommandeBonComponent,
        CommandeNouveauComponent,
        CommandeAnnuleComponent,
        CommandeEnvoiComponent,
        CommandeChoixProduitComponent,
        CommandeLigneAjouteComponent,
    ],
    providers: [
        CommandeEnvoiGardeService,
        CEnfantsDeBonGardeService,
        CommandeBonResolverService,
        CommandeProduitResolverService,
        CommandeLigneResolverService,
    ],
})
export class CommandeModule { }
