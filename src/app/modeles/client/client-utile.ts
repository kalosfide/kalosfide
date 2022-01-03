import { ClientService } from './client.service';
import { Client } from './client';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { FournisseurClientPages } from 'src/app/fournisseur/clients/client-pages';
import { ClientUtileUrl } from './client-utile-url';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { ClientUtileLien } from './client-utile-lien';
import { ClientUtileColonne } from './client-utile-colonne';
import { ClientUtileOutils } from './client-utile-outils';
import { ClientUtileBouton } from './client-utile-bouton';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';
import { KeyIdUtile } from 'src/app/commun/data-par-key/key-id/key-id-utile';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class ClientUtile extends KeyIdUtile<Client> {
    constructor(service: ClientService) {
        super(service);
        this.dataRouteur = Fabrique.url.appRouteur.clients;
        this.dataPages = FournisseurClientPages;
        this.pUrl = new ClientUtileUrl(this);
        this.pLien = new ClientUtileLien(this);
        this.pBouton = new ClientUtileBouton(this);
        this.pOutils = new ClientUtileOutils(this);
        this.pColonne = new ClientUtileColonne(this);
        this.pUrlKey = new DataKeyUtileUrl(this);
        this.pLienKey = new DataKeyUtileLien(this);
        this.pColonneKey = new DataKeyUtileColonne(this);
        this.pOutilsKey = new DataKeyUtileOutils(this);
    }

    fragment(client: Client): string {
        return 'kfvt' + KeyId.texteDeKey(client);
    }

    get url(): ClientUtileUrl {
        return this.pUrl as ClientUtileUrl;
    }

    get lien(): ClientUtileLien {
        return this.pLien as ClientUtileLien;
    }

    get bouton(): ClientUtileBouton {
        return this.pBouton as ClientUtileBouton;
    }

    get outils(): ClientUtileOutils {
        return this.pOutils as ClientUtileOutils;
    }

    get colonne(): ClientUtileColonne {
        return this.pColonne as ClientUtileColonne;
    }

    get service(): ClientService {
        return this.pService as ClientService;
    }

    get classeNouveau(): string {
        return KfBootstrap.classe('text', 'danger');
    }

    get joursInactifAvantFermé(): number {
        return 60;
    }

    textesEtatSite(ouvert: boolean): {
        titre: string,
        textes: string[]
    } {
        return ouvert
            ? {
                titre: 'Réouverture du site',
                textes: [
                    `La modification du catalogue est terminée.`,
                    `Vous avez à nouveau accès aux pages du catalogue et des commandes.`
                ]
            }
            : {
                titre: 'Le site est actuellement fermé',
                textes: [
                    `Une modification du catalogue est en cours.`,
                    `Vous ne pouvez pas accéder aux pages du catalogue et des commandes.`
                ]
            }
    }
}
