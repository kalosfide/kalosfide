import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommunModule } from '../commun/commun.module';

import { PageErreurComponent } from './page-erreur.component';
import { DispositionModule } from '../disposition/disposition.module';
import { ApiErreurResolverService } from './api-erreur-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommunModule,
        DispositionModule,
    ],
    declarations: [
        PageErreurComponent,
    ],
    providers: [
        ApiErreurResolverService
    ],
    exports: [
    ],
})
export class ErreursModule { }
