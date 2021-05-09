import { TypeResultatAffichable } from './type-resultat-affichable';
import { ApiResult } from 'src/app/api/api-results/api-result';

export interface IResultatAffichable {
    typeAlert: TypeResultatAffichable;
    titre: string;
    détails?: string[];
}

export class ResultatAction implements IResultatAffichable {
    private pOk: boolean;
    private pObjet: any;
    private pTitre: string;
    private pDétails: string[];
    private pApiResultRedirige: ApiResult;

    private constructor() {
    }

    static ok(titre: string, créé?: any): ResultatAction {
        const resultat = new ResultatAction();
        resultat.pOk = true;
        resultat.pTitre = titre;
        resultat.pObjet = créé;
        return resultat;
    }

    static conflit(erreur: any): ResultatAction {
        const resultat = new ResultatAction();
        resultat.pObjet = erreur;
        return resultat;
    }

    static afficheErreur(titre: string, détails?: string[]): ResultatAction {
        const resultat = new ResultatAction();
        resultat.pOk = false;
        resultat.pTitre = titre;
        resultat.pDétails = détails;
        return resultat;
    }

    static redirigeErreur(apiResultRedirige: ApiResult): ResultatAction {
        const resultat = new ResultatAction();
        resultat.pApiResultRedirige = apiResultRedirige;
        return resultat;
    }

    get ok(): boolean {
        return this.pOk;
    }
    get titre(): string {
        return this.pTitre;
    }
    get détails(): string[] {
        return this.pDétails;
    }
    get apiResultRedirige(): ApiResult {
        return this.pApiResultRedirige;
    }

    get typeAlert(): TypeResultatAffichable {
        return this.pOk ? 'success' : 'danger';
    }

    get créé(): any {
        return this.pObjet;
    }

    get erreur(): any {
        return this.pObjet;
    }
}
