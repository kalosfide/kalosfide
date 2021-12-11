import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
import { AdminGardeService } from './admin/admin-garde.service';
import { AppPages } from './app-pages';
import { IdentifiantGardeService } from './securite/identifant-garde.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: AppPages.appSite.path,
                pathMatch: 'full',
            },
            {
                path: AppPages.appSite.path,
                data: { pageDef: AppPages.appSite },
                loadChildren: () => import('./app-site/app-site.module').then(mod => mod.AppSiteModule)
            },
            {
                path: AppPages.site.path,
                loadChildren: () => import('./site/site.module').then(mod => mod.SiteModule),
                canActivate: [
                    IdentifiantGardeService,
                ]
            },
            {
                path: AppPages.admin.path,
                data: { pageDef: AppPages.admin },
                loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
                canActivate: [
                    AdminGardeService
                ],
                    },
            {
                path: '**',
                redirectTo: `${AppPages.appSite.path}/${AppPages.apiErreur.path}`,
            },
        ]
    },
];

@NgModule({

    imports: [
        QuicklinkModule,
        RouterModule.forRoot(
            routes,
            {
                preloadingStrategy: QuicklinkStrategy,
                relativeLinkResolution: 'legacy',
//                enableTracing: true,

                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                scrollOffset: [0, 0]
            }
        )
    ],

    exports: [RouterModule]

})
export class AppRoutingModule { }
