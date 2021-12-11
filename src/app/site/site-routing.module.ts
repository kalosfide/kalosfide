import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitePages } from './site-pages';
import { FournisseurRacineComponent } from './fournisseur-racine.component';
import { ClientRacineComponent } from './client-racine.component';
import { FournisseurGardeService } from './fournisseur-garde.service';
import { ClientGardeService } from './client-garde.service';
import { UsagerGardeService } from './usager-garde.service';
import { SiteResolverService } from './site-resolver.service';

const routes: Routes = [
    {
        path: ':urlSite',
        canActivate: [
            // Si l'utilisateur est identifié et si son identifiant possède le site dont l'url est le paramétre de la route,
            // fixe le role en cours de l'IdentificationService et laisse passer. Sinon, redirige vers la page erreur 404.
            // Les Resolver et Gardes suivants peuvent obtenir le role en cours par l'IdentificationService.
            UsagerGardeService
        ],
        resolve: {
            site: SiteResolverService
        },
        children: [
            {
                path: SitePages.fournisseur.path,
                data: {
                    pageDef: SitePages.fournisseur,
                    cheminDeTitre: ['site', 'titre']
                 },
                component: FournisseurRacineComponent,
                canActivateChild: [
                    // Si l'utilisateur est identifié et s'il est le fournisseur du site en cours du NavigationService, laisse passer.
                    // Sinon, redirige vers la page erreur 403.
                    FournisseurGardeService
                ],
                loadChildren: () => import('../fournisseur/fournisseur.module').then(mod => mod.FournisseurModule)
            },
            {
                path: SitePages.client.path,
                data: {
                    pageDef: SitePages.client,
                    cheminDeTitre: ['site', 'titre']
                 },
                component: ClientRacineComponent,
                canActivateChild: [
                    // Si l'utilisateur est identifié et s'il est client du site en cours du NavigationService, laisse passer.
                    // Sinon, redirige vers la page erreur 403.
                    ClientGardeService
                ],
                loadChildren: () => import('../client/client.module').then(mod => mod.ClientModule)
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SiteRoutingModule { }
