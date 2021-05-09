import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KfComposantsModule } from './kf-composants/kf-composants.module';
import { RouterModule } from '@angular/router';
import { KfComposantComponent } from './kf-composants/kf-composant/kf-composant.component';
import { PeutQuitterComponent } from './peut-quitter/peut-quitter.component';
import { PeutQuitterGarde } from './peut-quitter/peut-quitter-garde.service';
import { PeutQuitterService } from './peut-quitter/peut-quitter.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KfLienComponent } from './kf-composants/kf-elements/kf-lien/kf-lien.component';
import { KfGroupeComponent } from './kf-composants/kf-groupe/kf-groupe.component';
import { KfBoutonComponent } from './kf-composants/kf-elements/kf-bouton/kf-bouton.component';
import { KfEtiquetteComponent } from './kf-composants/kf-elements/kf-etiquette/kf-etiquette.component';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        KfComposantsModule,
        QuicklinkModule,
    ],
    declarations: [
        PeutQuitterComponent,
    ],
    entryComponents: [
        PeutQuitterComponent
    ],
    providers: [
        PeutQuitterGarde,
        PeutQuitterService,
    ],
    exports: [
        KfComposantComponent,
        KfGroupeComponent,
        KfBoutonComponent,
        KfEtiquetteComponent,
        KfLienComponent,
        QuicklinkModule
    ]
})
export class CommunModule {
}
