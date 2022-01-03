import { ActivatedRoute } from '@angular/router';

import { KeyIdNoService } from './key-id-no.service';
import { KeyIdNo } from './key-id-no';
import { DataKeyALESComponent } from '../data-key-ales.component';
import { Component,} from '@angular/core';
import { IKeyIdNo } from './i-key-id-no';

@Component({ template: '' })
export abstract class KeyIdNoALESComponent<T extends KeyIdNo> extends DataKeyALESComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyIdNoService<T>,
    ) {
        super(route, service);
    }

    get keyDeAjoute(): IKeyIdNo {
        const enCours = this.service.identification.siteEnCours;
        const key = {
            id: enCours.id,
            no: -1
        };
        return key;
    }

    fixeKeyDeAjoute(ajouté: T) {
    }
}
