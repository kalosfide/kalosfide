import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfBootstrapSpinner } from '../../kf-elements/kf-bootstrap-spinner/kf-bootstrap-spinner';
import { KfIcone } from '../../kf-elements/kf-icone/kf-icone';
import { KfSurvol } from './kf-survol';

@Component({
    selector: 'app-kf-survol',
    templateUrl: './kf-survol.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfSurvolComponent extends KfComposantComponent implements OnInit {
    get survol(): KfSurvol {
        return this.composant as KfSurvol;
    }

    get bootstrapSpinner(): KfBootstrapSpinner {
        if (this.survol.survole.type === KfTypeDeComposant.bsSpinner) {
            return this.survol.survole as KfBootstrapSpinner;
        }
    }
    get icone(): KfIcone {
        if (this.survol.survole.type === KfTypeDeComposant.icone) {
            return this.survol.survole as KfIcone;
        }
    }
}
