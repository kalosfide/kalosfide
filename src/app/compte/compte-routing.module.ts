import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionComponent } from './connection/connection.component';
import { DeconnectionComponent } from './deconnection/deconnection.component';
import { ComptePages } from './compte-pages';
import { ConfirmeEmailComponent } from './confirme-email/confirme-email.component';
import { AjouteComponent } from './ajoute/ajoute.component';
import { OubliMotDePasseComponent } from './oubli-mot-de-passe/oubli-mot-de-passe.component';
import { RéinitialiseMotDePasseComponent } from './réinitialise-mot-de-passe/réinitialise-mot-de-passe.component';
import { QueryParamIdCodeResolverService } from './query-param-id-code-resolver.service';
import { ChangeMotDePasseComponent } from './change-mot-de-passe/change-mot-de-passe.component';
import { IdentifiantGardeService } from '../securite/identifant-garde.service';
import { ConfirmeChangeEmailComponent } from './confirme-email/confirme-change-email.component';
import { QueryParamEmailPossibleResolverService } from './query-param-email-possible-resolver.service';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { QueryParamEmailRequisResolverService } from './query-param-email-requis-resolver.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ComptePages.ajoute.urlSegment,
                data: { pageDef: ComptePages.ajoute },
                component: AjouteComponent,
            },
            {
                path: ComptePages.confirmeEmail.urlSegment,
                data: { pageDef: ComptePages.confirmeEmail },
                component: ConfirmeEmailComponent,
                resolve: {
                    idCode: QueryParamIdCodeResolverService,
                    email: QueryParamEmailRequisResolverService,
                },
            },
            {
                path: ComptePages.connection.urlSegment,
                data: { pageDef: ComptePages.connection },
                component: ConnectionComponent,
                resolve: {
                    email: QueryParamEmailPossibleResolverService,
                },
            },
            {
                path: ComptePages.deconnection.urlSegment,
                component: DeconnectionComponent,
                canActivate: [
                    IdentifiantGardeService,
                ]
            },
            {
                path: ComptePages.oubliMotDePasse.urlSegment,
                data: { pageDef: ComptePages.oubliMotDePasse },
                component: OubliMotDePasseComponent
            },
            {
                path: ComptePages.réinitialiseMotDePasse.urlSegment,
                data: { pageDef: ComptePages.réinitialiseMotDePasse },
                component: RéinitialiseMotDePasseComponent,
                resolve: {
                    idCode: QueryParamIdCodeResolverService,
                },
            },
            {
                path: ComptePages.changeMotDePasse.urlSegment,
                data: { pageDef: ComptePages.changeMotDePasse },
                component: ChangeMotDePasseComponent,
                canActivate: [
                    IdentifiantGardeService,
                ]
            },
            {
                path: ComptePages.changeEmail.urlSegment,
                data: { pageDef: ComptePages.changeEmail },
                component: ChangeEmailComponent,
                canActivate: [
                    IdentifiantGardeService,
                ]
            },
            {
                path: ComptePages.confirmeChangeEmail.urlSegment,
                data: { pageDef: ComptePages.confirmeChangeEmail },
                component: ConfirmeChangeEmailComponent,
                resolve: {
                    idCode: QueryParamIdCodeResolverService,
                    email: QueryParamEmailRequisResolverService,
                },
            },
            {
                path: ComptePages.gestion.urlSegment,
                data: { pageDef: ComptePages.gestion },
                loadChildren: () => import('./gestion/gestion.module').then(mod => mod.GestionModule),
                canActivateChild: [
                    IdentifiantGardeService,
                ]
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompteRoutingModule { }
