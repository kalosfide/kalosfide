import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KfNgbModal } from './kf-ngb-modal';
import { KfEvenement, KfTypeDEvenement } from '../kf-partages/kf-evenements';

@Component({
    selector: 'app-kf-ngb-modal',
    templateUrl: './kf-ngb-modal.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfNgbModalComponent {
    @Input() modal: KfNgbModal;


    constructor(
        public activeModal: NgbActiveModal
    ) {
    }

    traiteClic(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.click) {
            this.activeModal.close(evenement.emetteur.nom);
        }
    }

}
