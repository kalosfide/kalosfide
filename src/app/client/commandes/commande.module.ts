import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { CommandeRoutingModule } from './commande-routing.module';
import { CommandeAccueilComponent } from './commande-accueil.component';
import { CommandeChoixProduitComponent } from './commande-choix-produit.component';
import { CommandeProduitResolverService } from './commande-produit-resolver.service';
import { CommandeLigneAjouteComponent } from './commande-ligne-ajoute.component';
import { RedirigeSiContexteChangé, RedirigeSiPasContexte } from './contexte-change-garde';
import { CommandeBonResolverService } from './commande-bon-resolver.service';
import { CommandeBonComponent } from './commande-bon.component';
import { CommandeAnnuleComponent } from './commande-annule.component';
import { CommandeBonExisteGardeService } from './commande-bon-existe-garde.service';
import { CommandeDoitCréerGardeService } from './commande-doit-creer-garde.service';
import { CommandeEnvoiGardeService } from './commande-envoi-garde.service';
import { CommandeNouveauComponent } from './commande-nouveau.component';
import { CommandeLigneResolverService } from './commande-ligne-resolver.service';
import { CommandeEnvoiComponent } from './commande-envoi.component';
import { CommandeProduitPasDansBonGardeService } from './commande-produit-pas-dans-bon-garde.service';

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
        RedirigeSiContexteChangé,
        RedirigeSiPasContexte,
        CommandeBonExisteGardeService,
        CommandeDoitCréerGardeService,
        CommandeEnvoiGardeService,
        CommandeBonResolverService,
        CommandeProduitResolverService,
        CommandeLigneResolverService,
        CommandeProduitPasDansBonGardeService,
    ],
})
export class CommandeModule { }
