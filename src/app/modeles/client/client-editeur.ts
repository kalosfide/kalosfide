import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import {  Client } from 'src/app/modeles/client/client';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { ClientPages } from '../../fournisseur/clients/client-pages';
import { TexteEtatClient } from 'src/app/modeles/client/etat-client';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { ClientService } from './client.service';
import { VisiteurPages } from 'src/app/visiteur/visiteur-pages';
import { EtapeDeFormulaireEditeur } from 'src/app/disposition/formulaire/etape-de-formulaire';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';

export class ClientEditeur extends KeyUidRnoEditeur<Client> implements EtapeDeFormulaireEditeur {
    texteEtat: KfInputTexte;
    grMessage: KfGroupe;

    kfNom: KfInputTexte;
    kfTexteEtat: KfInputTexte;

    constructor(component: IDataKeyComponent) {
        super(component);
        this.keyAuto = true;
    }

    get service(): ClientService {
        return this.component.iservice as ClientService;
    }

    private validateursNomAjoute(): KfValidateur[] {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPris(value);
            },
            'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            validateur
        ];
    }
    private validateursNomEdite(): KfValidateur[] {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPrisParAutre(this._kfUid.valeur, this._kfRno.valeur, value);
            },
            'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            validateur
        ];
    }

    créeNom(validateurs?: KfValidateur[]): KfInputTexte {
        if (!validateurs) {
            this.kfNom = Fabrique.input.texteLectureSeule('nom', 'Nom');
        } else {
            this.kfNom = Fabrique.input.texte('nom', 'Nom');
            validateurs.forEach(v => this.kfNom.ajouteValidateur(v));
        }
        return this.kfNom;
    }

    private validateursAdresse(): KfValidateur[] {
        const validateurs: KfValidateur[] = [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
        ];
        return validateurs;
    }

    créeAdresse(validateurs?: KfValidateur[]): KfInputTexte {
        if (!validateurs) {
            return Fabrique.input.texteLectureSeule('adresse', 'Adresse');
        } else {
            const adresse = Fabrique.input.texte('adresse', 'Adresse');
            validateurs.forEach(v => adresse.ajouteValidateur(v));
            return adresse;
        }
    }

    créeEtat(): KfInputTexte {
        return Fabrique.input.texteInvisible('etat');
    }

    créeTexteEtat(): KfInputTexte {
        this.kfTexteEtat = Fabrique.input.texteLectureSeule('texteEtat', 'Etat');
        this.kfTexteEtat.estRacineV = true;
        return this.kfTexteEtat;
    }

    créeKfDeData() {
        switch (this.pageDef) {
            case VisiteurPages.devenirClient:
                this.kfDeData = [
                    this.créeNom(this.validateursNomAjoute()),
                    this.créeAdresse(this.validateursAdresse()),
                ];
                break;
            case ClientPages.ajoute:
                this.kfDeData = [
                    this.créeNom(this.validateursNomAjoute()),
                    this.créeAdresse(this.validateursAdresse()),
                    this.créeEtat(),
                ];
                break;
            case ClientPages.edite:
                this.kfDeData = [
                    this.créeNom(this.validateursNomEdite()),
                    this.créeAdresse(this.validateursAdresse()),
                    this.créeEtat(),
                ];
                break;
            case ClientPages.accepte:
                this.kfDeData = [
                    this.créeNom(),
                    this.créeAdresse(),
                    this.créeEtat(),
                    this.créeTexteEtat()
                ];
                break;
            case ClientPages.exclut:
                this.kfDeData = [
                    this.créeNom(),
                    this.créeAdresse(),
                    this.créeEtat(),
                    this.créeTexteEtat()
                ];
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
        return [
            this.créeNom(this.validateursNomAjoute()),
            this.créeAdresse(this.validateursAdresse()),
        ];
    }
}
