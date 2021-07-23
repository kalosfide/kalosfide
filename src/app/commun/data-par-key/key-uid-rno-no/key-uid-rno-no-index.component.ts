import { Router, ActivatedRoute } from '@angular/router';

import { KeyUidRnoNoService } from './key-uid-rno-no.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { KeyUidRnoNo } from './key-uid-rno-no';
import { Component,} from '@angular/core';

@Component({ template: '' })
export abstract class KeyUidRnoNoIndexComponent<T extends KeyUidRnoNo> extends DataKeyIndexComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyUidRnoNoService<T>,
    ) {
        super(route, service);
    }

    urlSegmentDeKey = (t: T): string => {
        return '' + t.no;
    }
}
