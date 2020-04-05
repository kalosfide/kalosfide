import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from '../../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs, KfValidateur } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { EtapeDeFormulaireEditeur } from '../../disposition/formulaire/etape-de-formulaire';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { PageDef } from 'src/app/commun/page-def';
import { VisiteurPages } from 'src/app/visiteur/visiteur-pages';
import { TexteEtatClient } from './etat-client';
import { ClientPages } from 'src/app/fournisseur/clients/client-pages';
import { ClientService } from './client.service';

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

export class Client extends KeyUidRno implements IClientData {
    // key du client
    nom: string;
    adresse?: string;
    etat: string;
    dateEtat: Date;
    avecCompte: boolean;
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
