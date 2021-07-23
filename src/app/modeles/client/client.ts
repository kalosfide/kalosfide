import { InvitationDeApi } from './invitation';
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
}

/**
 * Si dans liste ne contient que
 */
export class Client extends Role implements IClientData {
    email: string;
    /**
     * Fixé lors des lectures mais pas stocké
     */
    invitation?: InvitationDeApi;
    avecDocuments: boolean;

    /**
     * recopie les champs hors clé qui sont définis
     * @param de Client
     */
    static copieData(de: IClientData, vers: Client) {
        vers.nom = de.nom;
        vers.adresse = de.adresse;
    }

}
