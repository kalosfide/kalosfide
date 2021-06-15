import { ClientUtile } from './client-utile';
import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Client } from './client';
import { TexteEtatClient, EtatClient } from './etat-client';
import { Compare } from '../../commun/outils/tri';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';

export class ClientUtileColonne extends DataUtileColonne {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this._parent as ClientUtile;
    }

    nom(): IKfVueTableColonneDef<Client> {
        const créeContenu = (client: Client) => client.nom;
        return {
            nom: 'nom',
            enTeteDef: { titreDef: 'Nom' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
    }

    adresse(): IKfVueTableColonneDef<Client> {
        const créeContenu = (client: Client) => client.adresse;
        return {
            nom: 'adresse',
            enTeteDef: { titreDef: 'Adresse' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
    }

    état(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (client: Client) => () => TexteEtatClient(client.etat),
            compare: Compare.enchaine(
                Compare.texte((client: Client) => TexteEtatClient(client.etat)),
                Compare.date((client: Client) => client.dateEtat)
            )
        };
    }

    date(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'date',
            enTeteDef: { titreDef: 'Date' },
            créeContenu: (client: Client) => () => TexteOutils.date.en_chiffres(client.dateEtat),
            classeDefs: ['date'],
            compare: Compare.date((client: Client) => client.dateEtat)
        };
    }

    connection(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'connection',
            enTeteDef: { titreDef: 'Avec compte' },
            créeContenu: (client: Client) => client.compte === 'O' ? 'Oui' : 'Non',
            compare: Compare.texte((client: Client) => client.compte)
        };
    }

    invite(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'invite',
            enTeteDef: { titreDef: 'Avec compte' },
            créeContenu: (client: Client) => {
                if (client.compte === 'O') {
                    const texte = new KfTexte('', 'Oui');
                    texte.ajouteClasse('btn texte-sous-icone'); // pour centrer
                    return texte;
                }
                const lien = client.compte === 'I' ? this.utile.lien.invité(client) : this.utile.lien.invite(client);
                lien.inactivité = client.etat !== EtatClient.actif;
                return lien;
            },
            classeDefs: ['client-compte'],
            compare: Compare.texte((client: Client) => client.compte),
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    edite(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'edite',
            créeContenu: (client: Client) => {
                if (client.etat === EtatClient.nouveau) {
                    return this.utile.lien.accepte(client);
                }
                const lien = this.utile.lien.edite(client);
                lien.inactivité = client.compte !== 'N' || client.etat !== EtatClient.actif;
                return lien;
            },
            classeDefs: ['action'],
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    exclut(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'exclut',
            créeContenu: (client: Client) => {
                if (client.etat === EtatClient.inactif) {
                    return this.utile.lien.accepte(client);
                }
                if (client.etat === EtatClient.actif && !client.compte && !client.avecCommandes) {
                    return this.utile.lien.supprime(client);
                }
                const lien = this.utile.lien.exclut(client);
                lien.inactivité = client.etat === EtatClient.exclu;
                return lien;
            },
            classeDefs: ['action'],
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    colonnesBase(): IKfVueTableColonneDef<Client>[] {
        return [
            this.nom(),
            this.adresse(),
            this.état(),
            this.date(),
        ];
    }

    colonnesLivraison(): IKfVueTableColonneDef<Client>[] {
        return this.colonnesBase().concat([
            this.connection(),
        ]);
    }

    colonnes(): IKfVueTableColonneDef<Client>[] {
        return this.colonnesBase().concat([
            this.invite(),
            this.edite(),
            this.exclut(),
        ]);
    }

}
