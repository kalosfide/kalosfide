import { Router, ActivatedRoute } from '@angular/router';

import { KeyUidRnoService } from './key-uid-rno.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { KeyUidRno } from './key-uid-rno';
import { Component,} from '@angular/core';

@Component({ template: '' })
export abstract class KeyUidRnoIndexComponent<T extends KeyUidRno> extends DataKeyIndexComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyUidRnoService<T>,
    ) {
        super(route, service);
    }
}
