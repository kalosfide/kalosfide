import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataResolverService } from '../../../services/data-resolver.service';
import { CLFDoc } from '../c-l-f-doc';
import { TypeCLF } from '../c-l-f-type';
import { map } from 'rxjs/operators';
import { CLFService } from '../c-l-f.service';
import { NomParam } from '../../nom-param';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { KeyIdNo } from 'src/app/commun/data-par-key/key-id-no/key-id-no';
import { IKeyId } from 'src/app/commun/data-par-key/key-id/i-key-id';
import { Client } from '../../client/client';

export abstract class CLFDocumentResolverService extends DataResolverService {

    constructor(
        protected service: CLFService,
    ) {
        super();
    }

    protected abstract client(): Client;

    /**
     * Pour le client et le fournisseur.
     * Le ApiDocs retourné par l'Api contient le document avec les lignes.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * Le CLFDocs retourné contient le Client du client.
     * Pas stocké.
     * @param route doit avoir un data avec un champ typeCLF
     */
    document(route: ActivatedRouteSnapshot): Observable<CLFDoc> {
        const type: TypeCLF = route.data.typeCLF;
        if (!type) {
            throw new Error(`CLFDocumentResolverService : la route doit avoir un data avec un champ typeCLF.`)
        }
        const site = this.service.litSiteEnCours();
        const client = this.client();
        const paramNoDoc = route.paramMap.get(NomParam.noDoc);
        if (!paramNoDoc) {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return null;
        }
        return this.service.document(client, +paramNoDoc, type).pipe(
            map(clfDocs => {
                clfDocs.site = site;
                if (!clfDocs.client) {
                    clfDocs.client = client;
                }
                return clfDocs.créeVue(type);
            })
        );
    }

    /**
     * Pour le client et le fournisseur.
     * Le ApiDocs retourné par l'Api contient le document avec les lignes.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * Le CLFDocs retourné contient le Client du client.
     * Pas stocké.
     * @param route doit avoir un data avec un champ typeCLF
     */
    documentCherché(route: ActivatedRouteSnapshot): Observable<CLFDoc> {
        const type: TypeCLF = route.data.typeCLF;
        if (!type) {
            throw new Error(`CLFDocumentResolverService : la route doit avoir un data avec un champ typeCLF.`)
        }
        const paramKeyDoc = route.paramMap.get(NomParam.keyDoc);
        if (!paramKeyDoc) {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return null;
        }
        const keyDoc = KeyIdNo.keyDeTexte(paramKeyDoc);
        return this.service.document(keyDoc, keyDoc.no, type).pipe(
            map(clfDocs => {
                clfDocs.site = this.service.litSiteEnCours();
                return clfDocs.créeVue(type);
            })
        );
    }

}
