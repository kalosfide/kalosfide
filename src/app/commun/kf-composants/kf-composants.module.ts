import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KfComposantComponent } from './kf-composant/kf-composant.component';
import { KfBoutonComponent } from './kf-elements/kf-bouton/kf-bouton.component';
import { KfEtiquetteComponent } from './kf-elements/kf-etiquette/kf-etiquette.component';
import { KfCaseACocherComponent } from './kf-elements/kf-case-a-cocher/kf-case-a-cocher.component';
import { KfRadiosComponent } from './kf-elements/kf-radios/kf-radios.component';
import { KfListeDeroulanteComponent } from './kf-elements/kf-liste-deroulante/kf-liste-deroulante.component';
import { KfVueJsonComponent } from './kf-elements/kf-vue-json/kf-vue-json.component';
import { KfGroupeComponent } from './kf-groupe/kf-groupe.component';
import { KfListeComponent } from './kf-liste/kf-liste.component';
import { KfMenuComponent } from './kf-menu/kf-menu.component';
import { KfSousMenuComponent } from './kf-menu/kf-sous-menu.component';
import { KfRadioComponent } from './kf-elements/kf-radios/kf-radio.component';
import { KfFichierSauveComponent } from './kf-elements/kf-fichier-sauve/kf-fichier-sauve.component';
import { KfFichierChargeComponent } from './kf-elements/kf-fichier-charge/kf-fichier-charge.component';
import { KfFichierComponent } from './kf-elements/kf-fichier/kf-fichier.component';
import { KfListeEditeurComponent } from './kf-liste/kf-liste-editeur.component';
import { KfLienComponent } from './kf-elements/kf-lien/kf-lien.component';
import { KfComposantsRoutingModule } from './kf-composants-routing.module';
import { OutilsModule } from '../outils/outils.module';
import { KfDialogueComponent } from './kf-dialogue/kf-dialogue.component';
import { KfDialogueService } from './kf-dialogue/kf-dialogue.service';
import { KfVueTableComponent } from './kf-vue-table/kf-vue-table.component';
import { KfContenuPhraseComponent } from './kf-partages/kf-contenu-phrase/kf-contenu-phrase.component';
import { KfInputComponent } from './kf-elements/kf-input/kf-input.component';
import { KfIconeComponent } from './kf-elements/kf-icone/kf-icone.component';
import { KfImageComponent } from './kf-elements/kf-image/kf-image.component';
import { KfTexteComponent } from './kf-elements/kf-texte/kf-texte.component';
import { KfNgbDropdownComponent } from './kf-elements/kf-ngb-dropdown/kf-ngb-dropdown.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KfBaliseComponent } from './kf-partages/kf-balise/kf-balise.component';
import { KfNavbarComponent } from './kf-navbar/kf-navbar.component';
import { KfUlOlComponent } from './kf-ul-ol/kf-ul-ol.component';
import { KfBBtnGroupComponent } from './kf-b-btn-group/kf-b-btn-group.component';
import { KfTableComponent } from './kf-table/kf-table.component';
import { KfNgbModalComponent } from './kf-ngb-modal/kf-ngb-modal.component';
import { KfNgbModalService } from './kf-ngb-modal/kf-ngb-modal.service';
import { KfDivComponent } from './kf-partages/kf-div/kf-div.component';
import { KfBootstrapSpinnerComponent } from './kf-elements/kf-bootstrap-spinner/kf-bootstrap-spinner.component';
import { KfSurvolComponent } from './kf-partages/kf-survol/kf-survol.component';
import { KfDescriptionsComponent } from './kf-description/kf-description.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    OutilsModule,
    KfComposantsRoutingModule,
  ],
  declarations: [
      KfContenuPhraseComponent,
      KfBaliseComponent,

      KfComposantComponent,
      KfGroupeComponent,
      KfBoutonComponent,
      KfCaseACocherComponent,
      KfEtiquetteComponent,
      KfFichierComponent,
      KfFichierChargeComponent,
      KfFichierSauveComponent,
      KfImageComponent,
      KfIconeComponent,
      KfLienComponent,
      KfTexteComponent,
      KfListeComponent,
      KfListeEditeurComponent,
      KfListeDeroulanteComponent,
      KfMenuComponent,
      KfSousMenuComponent,
      KfInputComponent,
      KfRadioComponent,
      KfRadiosComponent,
      KfVueJsonComponent,
      KfDialogueComponent,
      KfVueTableComponent,
      KfNgbDropdownComponent,
      KfNavbarComponent,
      KfBBtnGroupComponent,
      KfTableComponent,
      KfDivComponent,

      KfBootstrapSpinnerComponent,
      KfSurvolComponent,
      KfNgbModalComponent,

      KfUlOlComponent,
      KfDescriptionsComponent,
  ],
  entryComponents: [
      KfNgbModalComponent,
  ],
  providers: [
      KfDialogueService,
      KfNgbModalService,
  ],
  exports: [
      KfComposantComponent,
      KfGroupeComponent,
      KfBoutonComponent,
      KfEtiquetteComponent,
      KfLienComponent,
      KfUlOlComponent,
  ]
})
export class KfComposantsModule {
}
