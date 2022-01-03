import { Router, ActivatedRoute } from '@angular/router';

import { KeyIdNoService } from './key-id-no.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { KeyIdNo } from './key-id-no';
import { Component,} from '@angular/core';

@Component({ template: '' })
export abstract class KeyUidRnoNoIndexComponent<T extends KeyIdNo> extends DataKeyIndexComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyIdNoService<T>,
    ) {
        super(route, service);
    }

    urlSegmentDeKey = (t: T): string => {
        return '' + t.no;
    }
}
