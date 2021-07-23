import { CLFService } from '../c-l-f.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CLFDoc } from '../c-l-f-doc';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { CLFPages } from '../c-l-f-pages';
import { CLFDocs } from '../c-l-f-docs';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { Observable } from 'rxjs';

export class CLFGardeService extends DataResolverService {
    nom: string; // debug
    nomResolver: string; // debug
    gardes: {
        condition: (doc: CLFDoc) => boolean,
        redirection: (doc: CLFDoc) => IUrlDef,
    }[];

    constructor(protected service: CLFService) {
        super();
    }

    commandeExisteEtEstOuverte(clfDoc: CLFDoc): boolean {
        return clfDoc.lignes && !clfDoc.date;
    }

    commandeNExistePasOuEstEnvoyée(clfDoc: CLFDoc): boolean {
        return !clfDoc.lignes || !!clfDoc.date;
    }

    /**
     * Retourne vrai si le bon est le bon virtuel (de no égal à 0) et si ce bon
     * n'existe pas dans l'Api (pas de lignes si jamais de livraison, date non nulle si lignes à copier de la dernière livraison)
     */
    bonEstVirtuelEtNExistePasOuEstEnvoyé(bon: CLFDoc): boolean {
        return bon.no === 0 && (!bon.lignes || !bon.date);
    }

    /**
     * Retourne vrai si le bon est le bon virtuel
     * @param route route à garder
     */
    commandeEstVirtuelle(clfDoc: CLFDoc): boolean {
        return clfDoc.no === 0;
    }

    /**
     * Retourne vrai si le bon est le bon virtuel (de no égal à 0) et si ce bon
     * existe dans l'Api (lignes et date nulle)
     * @param route route à garder
     */
    commandeEstVirtuelleEtOuverte(clfDoc: CLFDoc): boolean {
        return clfDoc.no === 0 && !clfDoc.date;
    }

    /**
     * Recherche KeyClient et noDoc dans les params de la route et de ses parents.
     * Redirige si le bon créé à partir de ces params ne satisfait pas la condition.
     * @param route route à garder
     */
     peutActiver(route: ActivatedRouteSnapshot): boolean {
        const clfDocs: CLFDocs = this.service.litStock();
        if (!clfDocs) {
            throw new Error('CLFGarde: La garde précédente doit avoir déjà résolu le clfDocs');
        }
        let clfDoc: CLFDoc;
        if (clfDocs.type === 'commande') {
            clfDoc = clfDocs.créeBon();
        } else {
            const noString = route.paramMap.get(CLFPages.nomParamNoDoc);
            if (!noString) {
                this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
                return false;
            }
            clfDoc = clfDocs.créeBon(+noString);
        }
        if (!clfDoc) {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return false;
        }
        for (const garde of this.gardes) {
            if (!garde.condition(clfDoc)) {
                this.service.routeur.navigueUrlDef(garde.redirection(clfDoc));
                return false;
            }
        }
        return true;
    }
}
