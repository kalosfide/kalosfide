import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitePages } from './site-pages';
import { FournisseurRacineComponent } from './fournisseur-racine.component';
import { ClientRacineComponent } from './client-racine.component';
import { FournisseurGarde } from './fournisseur-garde';
import { ClientGarde } from './client-garde';
import { UsagerGarde } from './usager-garde';

const routes: Routes = [
    {
        path: ':urlSite',
        canActivateChild: [
            // Si l'utilisateur est identifié et si son identifiant possède le site dont l'url est le paramétre de la route,
            // fixe le site en cours du NavigationService et laisse passer. Sinon, redirige vers la page erreur 404.
            // Les Resolver et Gardes suivants peuvent obtenir le site par le NavigationService.
            UsagerGarde
        ],
        children: [
            {
                path: SitePages.fournisseur.urlSegment,
                data: {
                    pageDef: SitePages.fournisseur,
                    cheminDeTitre: ['site', 'titre']
                 },
                component: FournisseurRacineComponent,
                canActivateChild: [
                    // Si l'utilisateur est identifié et s'il est le fournisseur du site en cours du NavigationService, laisse passer.
                    // Sinon, redirige vers la page erreur 403.
                    FournisseurGarde
                ],
                loadChildren: () => import('../fournisseur/fournisseur.module').then(mod => mod.FournisseurModule)
            },
            {
                path: SitePages.client.urlSegment,
                data: {
                    pageDef: SitePages.client,
                    cheminDeTitre: ['site', 'titre']
                 },
                component: ClientRacineComponent,
                canActivateChild: [
                    // Si l'utilisateur est identifié et s'il est client du site en cours du NavigationService, laisse passer.
                    // Sinon, redirige vers la page erreur 403.
                    ClientGarde
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
