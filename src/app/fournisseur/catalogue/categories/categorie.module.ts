import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorieRoutingModule } from './categorie-routing.module';
import { CategorieIndexComponent } from './categorie-index.component';
import { CategorieEditeComponent } from './categorie-edite.component';
import { CategorieAjouteComponent } from './categorie-ajoute.component';
import { CategorieResolverService } from '../../../modeles/catalogue/categorie-resolver.service';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { CategorieSitePasCatalogueGarde } from './categorie-site-pas-catalogue-garde';
import { CategorieSupprimeComponent } from './categorie-supprime.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CategorieRoutingModule,
    ],
    declarations: [
        CategorieAjouteComponent,
        CategorieEditeComponent,
        CategorieSupprimeComponent,
        CategorieIndexComponent,
    ],
    providers: [
        CategorieResolverService,
        CategorieSitePasCatalogueGarde,
    ],
})
export class CategorieModule { }
