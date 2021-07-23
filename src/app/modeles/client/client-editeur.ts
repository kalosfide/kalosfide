import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import {  Client } from 'src/app/modeles/client/client';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { FournisseurClientPages } from '../../fournisseur/clients/client-pages';
import { TexteEtatClient } from 'src/app/modeles/client/etat-client';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { ClientService } from './client.service';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { RoleEditeur } from '../role/role-editeur';

export class ClientEditeur extends KeyUidRnoEditeur<Client> {
    kfNom: KfInputTexte;
    kfAdresse: KfInputTexte;
    kfTexteEtat: KfInputTexte;

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
        const roleEditeur = new RoleEditeur(this.component);
        roleEditeur.kfDeData = [];
        this.kfDeData = roleEditeur.kfDeData;
        switch (this.pageDef) {
            case AppSitePages.devenirClient:
                roleEditeur.ajouteAideNom('client'),
                this.kfNom = roleEditeur.ajouteNom('client', roleEditeur.validateursNom());
                this.kfNom.ajouteValidateur(this.validateurNomAprèsSoumission());
                roleEditeur.ajouteAideAdresse('client');
                this.kfAdresse = roleEditeur.ajouteAdresse(roleEditeur.validateursAdresse());
                break;
            case FournisseurClientPages.ajoute:
                roleEditeur.ajouteAideNom('client'),
                this.kfNom = roleEditeur.ajouteNom('client', roleEditeur.validateursNom());
                // vérifie que le nom n'appartient pas un client déjà connu
                this.kfNom.ajouteValidateur(this.validateurNomAjoute());
                // vérifie que le nom n'appartient pas à un client qui vient de répondre à une invitation
                this.kfNom.ajouteValidateur(this.validateurNomAprèsSoumission());
                roleEditeur.ajouteAideAdresse('client');
                this.kfAdresse = roleEditeur.ajouteAdresse(roleEditeur.validateursAdresse());
                break;
            case FournisseurClientPages.edite:
                roleEditeur.ajouteAideNom('client'),
                this.kfNom = roleEditeur.ajouteNom('client', roleEditeur.validateursNom());
                this.kfNom.ajouteValidateur(this.validateurNomEdite());
                roleEditeur.ajouteAideAdresse('client');
                this.kfAdresse = roleEditeur.ajouteAdresse(roleEditeur.validateursAdresse());
                break;
            case FournisseurClientPages.accepte:
            case FournisseurClientPages.exclut:
                roleEditeur.ajouteNom('client');
                roleEditeur.ajouteAdresse();
                roleEditeur.ajouteEtat();
                this.kfTexteEtat = roleEditeur.ajouteTexteEtat();
                break;
            default:
                break;
        }
    }
    fixeValeurEdition(valeur: Client) {
        this.edition.fixeValeur(valeur);
        if (this.kfTexteEtat) {
            this.kfTexteEtat.valeur = TexteEtatClient(valeur.etat);
        }
    }

    créeContenus(): KfComposant[] {
        this.créeKfDeData();
        return this.kfDeData;
    }
}
