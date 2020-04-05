import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FSitePages } from './f-site-pages';
import { SiteEditeComponent } from './site-edite.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: FSitePages.edite.urlSegment,
                pathMatch: 'full',
            },
            {
                path: FSitePages.edite.urlSegment,
                data: {
                    pageDef: FSitePages.edite,
                    estEnfantPathVide: true
                },
                component: SiteEditeComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FSiteRoutingModule { }
