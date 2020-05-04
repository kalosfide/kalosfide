import { TypeCLF, apiType } from './c-l-f-type';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

export class CLFFiltre extends KeyUidRno {
    /**
     * uid du client si l'utilisateur est le client.
     * uid du site si l'utilisateur est le fournisseur..
     */
    uid: string;
    /**
     * rno du client si l'utilisateur est le client.
     * rno du site si l'utilisateur est le fournisseur..
     */
    rno: number;
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

    constructor(keyClientOuSite: KeyUidRno) {
        super();
        this.uid = keyClientOuSite.uid;
        this.rno = keyClientOuSite.rno;
    }

    créeParams(): { [key: string]: string } {
        const params: { [key: string]: string } = {};
        params.uid = this.uid;
        params.rno = '' + this.rno;
        if (this.type) {
            params.type = apiType(this.type);
        }
        if (this.dateMin) {
            params.dateMin = this.dateMin.toJSON();
        }
        if (this.dateMax) {
            params.dateMax = this.dateMax.toJSON();
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
