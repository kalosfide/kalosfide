import { Router, ActivatedRoute } from '@angular/router';

import { KeyUidRnoNoService } from './key-uid-rno-no.service';
import { KeyUidRnoNo } from './key-uid-rno-no';
import { DataKeyALESComponent } from '../data-key-ales.component';
import { Component,} from '@angular/core';
import { IKeyUidRnoNo } from './i-key-uid-rno-no';
import { KeyUidRnoNoEditeur } from './key-uid-rno-no-editeur';

@Component({ template: '' })
export abstract class KeyUidRnoNoALESComponent<T extends KeyUidRnoNo> extends DataKeyALESComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyUidRnoNoService<T>,
    ) {
        super(route, service);
    }

    get keyDeAjoute(): IKeyUidRnoNo {
        const enCours = this.service.identification.roleEnCours;
        const key = {
            uid: enCours.uid,
            rno: enCours.rno,
            no: -1
        };
        return key;
    }

    fixeKeyDeAjoute(ajouté: T) {
        (this.dataEditeur as KeyUidRnoNoEditeur<T>).fixeNoDeAjout(ajouté);
    }
}
