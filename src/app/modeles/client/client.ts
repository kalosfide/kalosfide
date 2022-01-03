import { InvitationDeApi } from './invitation';
import { IRoleData, IRoleEtat, IRolePréférences, Role } from '../role/role';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { EtatRole } from '../role/etat-role';

export interface IClientData extends IRoleData {

}

export class Client extends KeyId implements IClientData, IRolePréférences, IRoleEtat  {
    email: string;
    nom: string;
    adresse: string;
    ville: string;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
    etat: EtatRole;
    date0: Date;
    dateEtat: Date;
    /**
     * Fixé lors des lectures mais pas stocké
     */
    invitation?: InvitationDeApi;
    avecDocuments: boolean;

    static copieData(de: IClientData, vers: IClientData) {
        Role.copieData(de, vers);
    }

}
