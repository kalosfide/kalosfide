import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogueResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';
import { SitePages } from 'src/app/site/site-pages';
import { VCProduitsComponent } from './v-c-produits.component';
import { VCEtatOuvertGardeService } from './v-c-etat-ouvert-garde.service';
import { VCModifEnCoursComponent } from './v-c-modif-en-cours.component';
import { VCEtatCatalogueGardeService } from './v-c-etat-catalogue-garde.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: SitePages.catalogue.urlSegment,
        pathMatch: 'full',
    },
    {
        path: SitePages.catalogue.urlSegment,
        data: { pageDef: undefined },
        component: VCProduitsComponent,
        canActivate: [
            VCEtatOuvertGardeService,
        ],
        resolve: {
            catalogue: CatalogueResolverService,
        },
    },
    {
        path: SitePages.pasOuvert.urlSegment,
        data: {
            pageDef: SitePages.pasOuvert,
            estEnfantPathVide: true,
        },
        component: VCModifEnCoursComponent,
        canActivate: [VCEtatCatalogueGardeService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VCCatalogueRoutingModule { }
