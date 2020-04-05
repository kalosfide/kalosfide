import { ClientUtile } from './client-utile';
import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Client } from './client';
import { Tri } from 'src/app/commun/outils/tri';
import { TexteEtatClient, EtatClient } from './etat-client';
import { Compare } from '../compare';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';

export class ClientUtileColonne extends DataUtileColonne {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this._parent as ClientUtile;
    }

    nom(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'nom',
            enTeteDef: { titreDef: 'Nom' },
            tri: new Tri<Client>('Nom', Compare.nomClient),
            créeContenu: (client: Client) => client.nom
        };
    }

    adresse(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'adresse',
            enTeteDef: { titreDef: 'Adresse' },
            créeContenu: (client: Client) => client.adresse
        };
    }

    état(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (client: Client) => ({ texteDef: () => TexteEtatClient(client.etat) })
        };
    }

    date(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'date',
            enTeteDef: { titreDef: 'Date' },
            créeContenu: (client: Client) => ({ texteDef: () => TexteOutils.date.en_chiffres(client.dateEtat) })
        };
    }

    connection(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'connection',
            enTeteDef: { titreDef: 'Connection' },
            créeContenu: (client: Client) => client.avecCompte ? 'Oui' : 'Non'
        };
    }

    edite(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'edite',
            créeContenu: (client: Client) => {
                if (client.etat === EtatClient.nouveau) {
                    return { composant: this.utile.lien.accepte(client) };
                }
                const lien = this.utile.lien.edite(client);
                lien.inactivité = client.avecCompte || client.etat !== EtatClient.actif;
                return { composant: lien };
            },
            nePasAfficherSi: this.utile.conditionTable.pasEdition,
        };
    }

    exclut(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'exclut',
            créeContenu: (client: Client) => {
                if (client.etat === EtatClient.inactif) {
                    return { composant: this.utile.lien.accepte(client) };
                }
                if (client.etat === EtatClient.actif && !client.avecCompte && !client.avecCommandes) {
                    return { composant: this.utile.lien.supprime(client) };
                }
                const lien = this.utile.lien.exclut(client);
                lien.inactivité = client.etat === EtatClient.exclu;
                return { composant: lien };
            },
            nePasAfficherSi: this.utile.conditionTable.pasEdition,
        };
    }

    colonnesLivraison(): IKfVueTableColonneDef<Client>[] {
        return [
            this.nom(),
            this.adresse(),
            this.état(),
            this.date(),
            this.connection(),
        ];
    }

    colonnes(): IKfVueTableColonneDef<Client>[] {
        return this.colonnesLivraison().concat([
            this.edite(),
            this.exclut(),
        ]);
    }

}
