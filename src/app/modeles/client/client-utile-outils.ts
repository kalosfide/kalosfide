import { ClientUtile } from './client-utile';
import { ClientUtileUrl } from './client-utile-url';
import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { ClientUtileLien } from './client-utile-lien';
import { KfVueTableOutilBtnGroupe } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil-btn-group';
import { Client } from './client';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfVueTableFiltreTexte } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { EtatsRole, EtatRole } from '../role/etat-role';
import { KfListeDeroulanteNombre, KfListeDeroulanteTexte } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreNombre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';

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
        return Fabrique.vueTable.cherche<Client>('nom', 'nom', 'Rechercher un client');
    }

    état(): KfVueTableFiltreNombre<Client> {
        const filtre = Fabrique.vueTable.filtreNombre('etat', (c: Client, état: EtatRole) => c.etat === état, 'Filtrer par état')
        EtatsRole.états.forEach(état => (filtre.composant as KfListeDeroulanteNombre).créeEtAjouteOption(EtatsRole.texte(état), état));
        return filtre;
    }

    ajoute(): KfVueTableOutilBtnGroupe<Client> {
        return Fabrique.vueTable.outilAjoute(this.utile.lien.ajoute());
    }

}
