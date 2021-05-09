import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FournisseurClientPages } from './client-pages';
import { ClientIndexComponent } from './client-index.component';
import { ClientAjouteComponent } from './client-ajoute.component';
import { ClientEditeComponent } from './client-edite.component';
import { ClientResolverService } from '../../modeles/client/client-resolver.service';
import { ClientsResolverService } from '../../modeles/client/clients-resolver.service';
import { ClientAccepteComponent } from './client-accepte.component';
import { ClientExclutComponent } from './client-exclut.component';
import { ClientComponent } from './client.component';
import { ClientInviteComponent } from './client-invite.component';
import { FClientAccueilComponent } from './client-accueil.component';
import { ClientInvitationsComponent } from './client-invitations.component';
import { InvitationsResolverService } from 'src/app/modeles/invitation/invitations-resolver.service';
import { ClientInviteParentResolverService } from './client-invite-parent-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: ClientComponent,
        children: [
            {
                path: '',
                redirectTo: FournisseurClientPages.accueil.urlSegment,
                pathMatch: 'full',
            },
            {
                path: FournisseurClientPages.accueil.urlSegment,
                data: {
                    pageDef: FournisseurClientPages.accueil,
                    estEnfantPathVide: true
                },
                component: FClientAccueilComponent,
                resolve: {
                    liste: ClientsResolverService,
                }
            },
            {
                path: FournisseurClientPages.index.urlSegment,
                data: { pageDef: FournisseurClientPages.index },
                component: ClientIndexComponent,
                resolve: {
                    liste: ClientsResolverService,
                }
            },
            {
                path: FournisseurClientPages.invitations.urlSegment,
                data: { pageDef: FournisseurClientPages.invitations },
                component: ClientInvitationsComponent,
                resolve: {
                    liste: InvitationsResolverService,
                }
            },
            {
                path: FournisseurClientPages.ajoute.urlSegment,
                data: { pageDef: FournisseurClientPages.ajoute },
                component: ClientAjouteComponent,
            },
            {
                path: FournisseurClientPages.invite.urlSegment,
                data: { pageDef: FournisseurClientPages.invite },
                component: ClientInviteComponent,
                resolve: {
                    liste: InvitationsResolverService,
                    retour: ClientInviteParentResolverService,
                }
            },
            {
                path: FournisseurClientPages.invite.urlSegment + '/:key',
                data: { pageDef: FournisseurClientPages.invite },
                component: ClientInviteComponent,
                resolve: {
                    valeur: ClientResolverService,
                    liste: InvitationsResolverService,
                    retour: ClientInviteParentResolverService,
                },
            },
            {
                path: FournisseurClientPages.edite.urlSegment + '/:key',
                data: { pageDef: FournisseurClientPages.edite },
                component: ClientEditeComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
            },
            {
                path: FournisseurClientPages.accepte.urlSegment + '/:key',
                data: { pageDef: FournisseurClientPages.accepte },
                component: ClientAccepteComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
            },
            {
                path: FournisseurClientPages.exclut.urlSegment + '/:key',
                data: { pageDef: FournisseurClientPages.exclut },
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
