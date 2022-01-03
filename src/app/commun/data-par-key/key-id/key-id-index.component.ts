import { Router, ActivatedRoute } from '@angular/router';

import { KeyIdService } from './key-id.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { KeyId } from './key-id';
import { Component,} from '@angular/core';

@Component({ template: '' })
export abstract class KeyIdIndexComponent<T extends KeyId> extends DataKeyIndexComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyIdService<T>,
    ) {
        super(route, service);
    }
}
