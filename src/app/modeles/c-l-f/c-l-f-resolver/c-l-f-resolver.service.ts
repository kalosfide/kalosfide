import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { DataResolverService } from '../../../services/data-resolver.service';
import { CLFDoc } from '../c-l-f-doc';
import { TypeCLF } from '../c-l-f-type';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { CLFLigne } from '../c-l-f-ligne';
import { CLFPages } from '../c-l-f-pages';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { map,  switchMap } from 'rxjs/operators';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { CLFService } from '../c-l-f.service';
import { CLFDocs } from '../c-l-f-docs';

export class CLFResolverService extends DataResolverService {

    type: TypeCLF;

    constructor(
        protected service: CLFService,
    ) {
        super();
    }

    /**
     * Pour le client et le fournisseur.
     * Le CLFDocs lu dans l'Api contient le document avec les lignes.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * Le CLFDocs retourné contient le Client du client.
     * Pas stocké.
     */
    document(route: ActivatedRouteSnapshot, type: TypeCLF): Observable<CLFDoc> {
        let key: IKeyUidRnoNo;
        let paramKeyDoc = route.paramMap.get(CLFPages.nomParamKeyDoc);
        if (paramKeyDoc) {
            // Le paramètre de la route est la keyUidRnoNo du document si l'utilisateur est le fournisseur
            key = KeyUidRnoNo.keyDeTexte(paramKeyDoc);
        } else {
            // Le paramètre de la route est le no du document si l'utilisateur est le client
            paramKeyDoc = route.paramMap.get(CLFPages.nomParamNoDoc);
            const keyIdentifiant = this.service.keyIdentifiant;
            key = {
                uid: keyIdentifiant.uid,
                rno: keyIdentifiant.rno,
                no: +paramKeyDoc
            };
        }
        return this.service.document(key, type).pipe(map(clfDocs => clfDocs.créeVue(type))
        );
    }

}
