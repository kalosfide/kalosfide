import { ActivatedRoute } from '@angular/router';

import { KeyIdService } from './key-id.service';
import { DataKeyALESComponent } from '../data-key-ales.component';
import { KeyId } from './key-id';
import { Component,} from '@angular/core';
import { IKeyId } from './i-key-id';
import { KeyIdEditeur } from './key-id-editeur';

@Component({ template: '' })
export abstract class KeyIdALESComponent<T extends KeyId> extends DataKeyALESComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyIdService<T>,
    ) {
        super(route, service);
    }

    get keyDeAjoute(): IKeyId {
        const enCours = this.service.identification.litIdentifiant();
        const key = {
            id: -1
        };
        return key;
    }

    fixeKeyDeAjoute(ajouté: T) {
        (this.dataEditeur as KeyIdEditeur<T>).fixeIdDeAjout(ajouté);
    }
}
