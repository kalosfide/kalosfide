import { CLFService } from '../c-l-f.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CLFDoc } from '../c-l-f-doc';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { CLFPages } from '../c-l-f-pages';
import { CLFDocs } from '../c-l-f-docs';
import { ApiResult404NotFound } from 'src/app/commun/api-results/api-result-404-not-found';
import { Observable } from 'rxjs';

export class CLFProduitPasDansBonGardeService extends DataResolverService {

    constructor(protected service: CLFService) {
        super();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const clfDocs: CLFDocs = this.service.litStock();
        if (!clfDocs) {
            throw new Error('CLFGarde: La garde précédente doit avoir déjà résolu le clfDocs');
        }
        let clfDoc: CLFDoc;
        let urlDef: IUrlDef;
        if (clfDocs.type === 'commande') {
            clfDoc = clfDocs.créeBon();
            urlDef = this.service.utile.url.bon();
        } else {
            const noString = route.paramMap.get(CLFPages.nomParamNoDoc);
            if (!noString) {
                this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
                return false;
            }
            clfDoc = clfDocs.créeBon(+noString);
            urlDef = this.service.utile.url.bon(clfDoc);
        }
        if (!clfDoc) {
            this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
            return false;
        }
        const no2String = route.paramMap.get(CLFPages.nomParamNoLigne);
        if (!no2String) {
            this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
            return false;
        }
        const clfLigne = clfDoc.lignes.find(l => l.no2 === +no2String);
        if (clfLigne !== undefined) {
            this.service.routeur.navigueUrlDef(urlDef);
            return false;
        }
        return true;
    }
}
