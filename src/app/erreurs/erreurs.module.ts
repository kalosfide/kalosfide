import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommunModule } from '../commun/commun.module';

import { PageErreurComponent } from './page-erreur.component';
import { DispositionModule } from '../disposition/disposition.module';
import { ApiErreurResolverService } from './api-erreur-resolver.service';
import { ModalErreurComponent } from './modal-erreur.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommunModule,
        DispositionModule,
    ],
    declarations: [
        PageErreurComponent,
        ModalErreurComponent
    ],
    providers: [
        ApiErreurResolverService
    ],
    exports: [
    ],
})
export class ErreursModule { }
