import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FournisseurClientPages } from './client-pages';
import { ClientIndexComponent } from './client-index.component';
import { ClientAjouteComponent } from './client-ajoute.component';
import { ClientEditeComponent } from './client-edite.component';
import { ClientResolverService } from './client-resolver.service';
import { ClientsResolverService } from './clients-resolver.service';
import { ClientComponent } from './client.component';
import { ClientInviteComponent } from './client-invite.component';
import { FClientAccueilComponent } from './client-accueil.component';
import { ClientInvitationsComponent } from './client-invitations.component';
import { InvitationsResolverService } from './invitations-resolver.service';
import { InvitationResolverService } from './invitation-resolver.service';
import { ClientChargeEtLaissePasserGardeService } from './client-charge-et-laisse-passer-garde.service';
import { ClientDéfinitionsComponent } from './client-definitions.component';
import { ClientMéthodesComponent } from './client-methodes.component';

const routes: Routes = [
    {
        path: '',
        component: ClientComponent,
        canActivateChild: [
            ClientChargeEtLaissePasserGardeService
        ],
        children: [
            {
                path: '',
                redirectTo: FournisseurClientPages.accueil.path,
                pathMatch: 'full',
            },
            {
                path: FournisseurClientPages.accueil.path,
                data: {
                    pageDef: FournisseurClientPages.accueil,
                    estEnfantPathVide: true
                },
                component: FClientAccueilComponent,
                resolve: {
                    liste: ClientsResolverService,
                    invitations: InvitationsResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: FournisseurClientPages.définitions.path,
                        pathMatch: 'full',
                    },
                    {
                        path: FournisseurClientPages.définitions.path,
                        component: ClientDéfinitionsComponent
                    },
                    {
                        path: FournisseurClientPages.méthodes.path,
                        component: ClientMéthodesComponent,
                    }
                ]
            },
            {
                path: FournisseurClientPages.index.path,
                data: { pageDef: FournisseurClientPages.index },
                children: [
                    {
                        path: '',
                        component: ClientIndexComponent,
                        resolve: {
                            liste: ClientsResolverService,
                            invitations: InvitationsResolverService,
                        },
                    },
                    {
                        path: FournisseurClientPages.ajoute.path,
                        data: { pageDef: FournisseurClientPages.ajoute },
                        component: ClientAjouteComponent,
                    },
                    {
                        path: FournisseurClientPages.edite.path + '/:key',
                        data: { pageDef: FournisseurClientPages.edite },
                        component: ClientEditeComponent,
                        resolve: {
                            valeur: ClientResolverService,
                        },
                    },
                    {
                        path: FournisseurClientPages.invite.path + '/:key',
                        data: {
                            pageDef: FournisseurClientPages.inviteClient,
                            cheminDeKey: ['client', 'nom']
                        },
                        component: ClientInviteComponent,
                        resolve: {
                            client: ClientResolverService,
                            clients: ClientsResolverService,
                            invitation: InvitationResolverService,
                            liste: InvitationsResolverService,
                        },
                    },
                ],
            },
            {
                path: FournisseurClientPages.invitations.path,
                data: { pageDef: FournisseurClientPages.invitations },
                children: [
                    {
                        path: '',
                        component: ClientInvitationsComponent,
                        resolve: {
                            liste: InvitationsResolverService,
                        },
                    },
                    {
                        path: FournisseurClientPages.invite.path,
                        data: { pageDef: FournisseurClientPages.invite },
                        component: ClientInviteComponent,
                        resolve: {
                            clients: ClientsResolverService,
                            liste: InvitationsResolverService,
                        }
                    },
                    {
                        path: FournisseurClientPages.réinvite.path + '/:key',
                        data: {
                            pageDef: FournisseurClientPages.réinvite,
                            cheminDeKey: ['invitation', 'email']
                        },
                        component: ClientInviteComponent,
                        resolve: {
                            client: ClientResolverService,
                            clients: ClientsResolverService,
                            invitation: InvitationResolverService,
                            liste: InvitationsResolverService,
                        },
                    },
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
