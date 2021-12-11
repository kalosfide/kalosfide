import { ActivatedRoute } from '@angular/router';

import { KeyUidRnoService } from './key-uid-rno.service';
import { DataKeyALESComponent } from '../data-key-ales.component';
import { KeyUidRno } from './key-uid-rno';
import { Component,} from '@angular/core';
import { IKeyUidRno } from './i-key-uid-rno';
import { KeyUidRnoEditeur } from './key-uid-rno-no-editeur';

@Component({ template: '' })
export abstract class KeyUidRnoALESComponent<T extends KeyUidRno> extends DataKeyALESComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyUidRnoService<T>,
    ) {
        super(route, service);
    }

    get keyDeAjoute(): IKeyUidRno {
        const enCours = this.service.identification.litIdentifiant();
        const key = {
            uid: enCours.uid,
            rno: -1
        };
        return key;
    }

    fixeKeyDeAjoute(ajouté: T) {
        (this.dataEditeur as KeyUidRnoEditeur<T>).fixeNoDeAjout(ajouté);
    }
}
