import { ClientService } from './client.service';
import { Client } from './client';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { ClientRoutes, ClientPages } from 'src/app/fournisseur/clients/client-pages';
import { ClientUtileUrl } from './client-utile-url';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { ClientUtileLien } from './client-utile-lien';
import { ClientUtileColonne } from './client-utile-colonne';
import { ClientUtileOutils } from './client-utile-outils';
import { ClientUtileBouton } from './client-utile-bouton';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';
import { KeyUidRnoUtile } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-utile';

export class ClientUtile extends KeyUidRnoUtile<Client> {
    constructor(service: ClientService) {
        super(service);
        this.dataRoutes = ClientRoutes;
        this.dataPages = ClientPages;
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
}
