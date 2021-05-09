import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { Role } from '../role/role';

export interface IClientData {
    nom: string;
    adresse?: string;
}

export class ClientData implements IClientData {
    nom: string;
    adresse?: string;

    copieData(data: IClientData) {
        this.nom = data.nom;
        this.adresse = data.adresse;
    }

    get model(): ClientData {
        const model = new ClientData();
        model.nom = this.nom;
        model.adresse = this.adresse;
        return model;
    }
    set model(model: ClientData) {
        this.nom = model.nom;
        this.adresse = model.adresse;
    }
}

/**
 * Si dans liste ne contient que
 */
export class Client extends Role implements IClientData {
    // key du client
    compte: string;
    avecCommandes: boolean;

    /**
     * recopie les champs hors clé qui sont définis
     * @param de Client
     */
    static copieData(de: IClientData, vers: Client) {
        vers.nom = de.nom;
        vers.adresse = de.adresse;
    }

}
