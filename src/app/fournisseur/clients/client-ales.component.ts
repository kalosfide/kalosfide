import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientRoutes, ClientPages } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { Client } from 'src/app/modeles/client/client';
import { ClientService } from 'src/app/modeles/client/client.service';
import { ClientEditeur } from '../../modeles/client/client-editeur';
import { KeyUidRnoALESComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-ales.component';

export abstract class ClientALESComponent extends KeyUidRnoALESComponent<Client> implements OnInit {

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ClientPages;
    dataRoutes = ClientRoutes;

    site: Site;
    client: Client;
    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);
    }

    créeDataEditeur()  {
        this.dataEditeur = new ClientEditeur(this);
    }

    fixeValeur(client: Client) {
        this.dataEditeur.fixeValeur(client);
        this.client = client;
    }

}
