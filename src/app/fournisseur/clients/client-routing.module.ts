import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientPages } from './client-pages';
import { ClientIndexComponent } from './client-index.component';
import { ClientAjouteComponent } from './client-ajoute.component';
import { ClientEditeComponent } from './client-edite.component';
import { ClientResolverService } from '../../modeles/client/client-resolver.service';
import { ClientsResolverService } from '../../modeles/client/clients-resolver.service';
import { ClientAccepteComponent } from './client-accepte.component';
import { ClientExclutComponent } from './client-exclut.component';
import { ClientComponent } from './client.component';

const routes: Routes = [
    {
        path: '',
        component: ClientComponent,
        children: [
            {
                path: '',
                redirectTo: ClientPages.index.urlSegment,
                pathMatch: 'full',
            },
            {
                path: ClientPages.index.urlSegment,
                data: { pageDef: ClientPages.index },
                component: ClientIndexComponent,
                resolve: {
                    liste: ClientsResolverService,
                }
            },
            {
                path: ClientPages.ajoute.urlSegment,
                data: { pageDef: ClientPages.ajoute },
                component: ClientAjouteComponent,
            },
            {
                path: ClientPages.edite.urlSegment + '/:key',
                data: { pageDef: ClientPages.edite },
                component: ClientEditeComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
            },
            {
                path: ClientPages.accepte.urlSegment + '/:key',
                data: { pageDef: ClientPages.accepte },
                component: ClientAccepteComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
            },
            {
                path: ClientPages.exclut.urlSegment + '/:key',
                data: { pageDef: ClientPages.exclut },
                component: ClientExclutComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
