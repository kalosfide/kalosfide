import { ClientService } from './client.service';
import { Client } from './client';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { FournisseurClientRoutes, FournisseurClientPages } from 'src/app/fournisseur/clients/client-pages';
import { ClientUtileUrl } from './client-utile-url';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { ClientUtileLien } from './client-utile-lien';
import { ClientUtileColonne } from './client-utile-colonne';
import { ClientUtileOutils } from './client-utile-outils';
import { ClientUtileBouton } from './client-utile-bouton';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';
import { KeyUidRnoUtile } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-utile';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { IdEtatSite } from '../etat-site';

export class ClientUtile extends KeyUidRnoUtile<Client> {
    constructor(service: ClientService) {
        super(service);
        this.dataRoutes = FournisseurClientRoutes;
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
        return 'kfvt' + KeyUidRno.texteDeKey(client);
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

    textesEtatSite(état: IdEtatSite): {
        titre: string,
        textes: string[]
    } {
        return état === IdEtatSite.ouvert
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
