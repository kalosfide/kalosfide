import { ClientUtile } from './client-utile';
import { ClientUtileUrl } from './client-utile-url';
import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { ClientUtileLien } from './client-utile-lien';
import { KfVueTableOutilBtnGroupe } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil-btn-group';
import { Client } from './client';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class ClientUtileOutils extends DataUtileOutils {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this._dataUtile as ClientUtile;
    }

    get url(): ClientUtileUrl {
        return this.utile.url;
    }

    get lien(): ClientUtileLien {
        return this.utile.lien;
    }

    get nomOutil(): {
        client: string,
    } {
        return {
            client: 'client',
        };
    }

    client(): KfVueTableFiltreCherche<Client> {
        return Fabrique.vueTable.cherche<Client>('Nom', 'Nom',     (client: Client) => client.nom, 'Rechercher un client');
    }

    ajoute(): KfVueTableOutilBtnGroupe<Client> {
        return this.utile.outilsKey.outilAjoute();
    }

}
