import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
import { AppPages, AppRoutes } from './app-pages';
import { IdentifiantResolverService } from './securite/identifiant-resolver.service';

const routes: Routes = [
    {
        path: '',
        resolve: {
            identifiant: IdentifiantResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: AppPages.appSite.urlSegment,
                pathMatch: 'full',
            },
            {
                path: AppPages.appSite.urlSegment,
                data: { pageDef: AppPages.appSite },
                loadChildren: () => import('./app-site/app-site.module').then(mod => mod.AppSiteModule)
            },
            {
                path: AppPages.site.urlSegment,
                loadChildren: () => import('./site/site.module').then(mod => mod.SiteModule)
            },
            {
                path: '**',
                redirectTo: AppRoutes.url([AppPages.appSite.urlSegment, AppPages.introuvable.urlSegment]),
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
//                enableTracing: true // <-- debugging purposes only
            }
        )
    ],

    exports: [RouterModule]

})
export class AppRoutingModule { }
