import { Client } from 'src/app/modeles/client/client';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { FournisseurClientPages } from '../../fournisseur/clients/client-pages';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { ClientService } from './client.service';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { RoleEditeur } from '../role/role-editeur';

export class ClientEditeur extends KeyUidRnoEditeur<Client> {
    roleEditeur: RoleEditeur;

    constructor(component: IDataComponent) {
        super(component);
        this.keyAuto = true;
    }

    get service(): ClientService {
        return this.component.iservice as ClientService;
    }

    private validateurNomAprèsSoumission(): KfValidateur {
        const validateur = KfValidateurs.validateurAMarque('nomPris',
            'Ce nom est déjà pris');
        return validateur;
    }
    private validateurNomAjoute(): KfValidateur {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPris(value);
            },
            'Ce nom est déjà pris');
        return validateur;
    }
    private validateurNomEdite(): KfValidateur {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPrisParAutre(this._kfUid.valeur, this._kfRno.valeur, value);
            },
            'Ce nom est déjà pris');
        return validateur;
    }

    créeKfDeData() {
        const roleEditeur = new RoleEditeur(this.component, 'client');
        roleEditeur.créeKfDeData();
        switch (this.pageDef) {
            case AppSitePages.devenirClient:
                roleEditeur.kfNom.ajouteValidateur(this.validateurNomAprèsSoumission());
                break;
            case FournisseurClientPages.ajoute:
                // vérifie que le nom n'appartient pas un client déjà connu
                roleEditeur.kfNom.ajouteValidateur(this.validateurNomAjoute());
                // vérifie que le nom n'appartient pas à un client qui vient de répondre à une invitation
                roleEditeur.kfNom.ajouteValidateur(this.validateurNomAprèsSoumission());
                break;
            case FournisseurClientPages.edite:
                roleEditeur.kfNom.ajouteValidateur(this.validateurNomEdite());
                break;
            default:
                break;
        }
        this.kfDeData = roleEditeur.kfDeData;
        this.roleEditeur = roleEditeur;
    }
}
