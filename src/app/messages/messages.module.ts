import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommunModule } from '../commun/commun.module';

import { PageConflitComponent } from './page-conflit.component';
import { PageErreurComponent } from './page-erreur.component';
import { PageInterditeComponent } from './page-interdite.component';
import { PageIntrouvableComponent } from './page-introuvable.component';
import { DispositionModule } from '../disposition/disposition.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommunModule,
        DispositionModule,
    ],
    declarations: [
        PageInterditeComponent,
        PageIntrouvableComponent,
        PageConflitComponent,
        PageErreurComponent,
    ],
    providers: [
    ],
    exports: [
    ],
})
export class MessagesModule { }
