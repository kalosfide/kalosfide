import { TypeCLF, apiType } from './c-l-f-type';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { IKeyId } from 'src/app/commun/data-par-key/key-id/i-key-id';

/**
 * Définit les paramétres à envoyer à l'api pour recevoir une liste de documents vérifiant certaines conditions.
 */
export class CLFFiltre extends KeyId {
    /**
     * id du client ou du site
     */
    id: number;
    /**
     * TypeCLF
     */
    type: TypeCLF;
    /**
     * date minimum
     */
    dateMin: Date;
    /**
     * date maximum
     */
    dateMax: Date;
    /**
     * Index dans la liste des documents passant le filtre du premier document à retourner
     */
    i0: number;
    /**
     * nombre de documents à retourner
     */
    nb: number;

    constructor(keyClientOuSite: IKeyId) {
        super();
        this.id = keyClientOuSite.id;
    }

    créeParams(): { [key: string]: string } {
        const params: { [key: string]: string } = {};
        params.id = '' + this.id;
        if (this.type) {
            params.type = apiType(this.type);
        }
        if (this.dateMin) {
            params.dateMin = '' + this.dateMin;
        }
        if (this.dateMax) {
            params.dateMax = '' + this.dateMax;
        }
        if (this.i0 !== null && this.i0 !== undefined) {
            params.i0 = '' + this.i0;
        }
        if (this.nb !== null && this.nb !== undefined) {
            params.nb = '' + this.nb;
        }
        return params;
    }
}
