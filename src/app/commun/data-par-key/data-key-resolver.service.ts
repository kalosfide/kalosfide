import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { DataKeyService } from './data-key.service';
import { IDataKey } from './data-key';
import { DataResolverService } from 'src/app/services/data-resolver.service';

export abstract class DataKeyResolverService<T extends IDataKey> extends DataResolverService {
    constructor(
        protected service: DataKeyService<T>
    ) {
        super();
    }

    résoudObjet(route: ActivatedRouteSnapshot, key: IDataKey): Observable<T> {
        return this.service.objet<T>(this.service.lit(key));
    }

}
