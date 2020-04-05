import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionComponent } from './connection/connection.component';
import { DeconnectionComponent } from './deconnection/deconnection.component';
import { ComptePages } from './compte-pages';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ComptePages.connection.urlSegment,
                data: { pageDef: ComptePages.connection },
                component: ConnectionComponent
            },
            {
                path: ComptePages.deconnection.urlSegment,
                component: DeconnectionComponent
            },
            {
                path: ComptePages.gestion.urlSegment,
                data: { pageDef: ComptePages.gestion },
                loadChildren: () => import('./gestion/gestion.module').then(mod => mod.GestionModule)
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompteRoutingModule { }
