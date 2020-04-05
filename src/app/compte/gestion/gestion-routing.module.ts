import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionComponent } from './gestion/gestion.component';
import { GestionIndexComponent } from './gestion-index/gestion-index.component';

const routes: Routes = [
    {
        path: '',
        component: GestionComponent,
        children: [
            {
                path: '',
                component: GestionIndexComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GestionRoutingModule { }
