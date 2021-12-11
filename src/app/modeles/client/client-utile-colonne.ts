import { ClientUtile } from './client-utile';
import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Client } from './client';
import { TexteEtatRole, IdEtatRole } from '../role/etat-role';
import { Compare } from '../../commun/outils/tri';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';

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

    créé(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'cree',
            enTeteDef: { titreDef: 'Créé' },
            créeContenu: (client: Client) => () => TexteOutils.date.en_chiffres(client.date0),
            largeur: LargeurColonne.date,
            compare: Compare.date((client: Client) => client.date0)
        };
    }

    état(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (client: Client) => () => TexteEtatRole(client.etat),
            compare: Compare.enchaine(
                Compare.texte((client: Client) => TexteEtatRole(client.etat)),
                Compare.date((client: Client) => client.dateEtat)
            ),
            largeur: LargeurColonne.role_état
        };
    }

    date(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'date',
            enTeteDef: { titreDef: 'Depuis' },
            créeContenu: (client: Client) => () => TexteOutils.date.en_chiffres(client.dateEtat),
            largeur: LargeurColonne.date,
            compare: Compare.date((client: Client) => client.dateEtat)
        };
    }

    email(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'email',
            enTeteDef: { titreDef: 'Email' },
            créeContenu: (client: Client) => {
                if (client.email) {
                    const texte = new KfTexte('', client.email);
                    return texte;
                }
                const lien = client.invitation ? this.utile.lien.invité(client) : this.utile.lien.inviter(client);
                lien.inactivité = client.etat !== IdEtatRole.actif;
                return lien;
            },
            largeur: LargeurColonne.client_compte,
            compare: Compare.texte((client: Client) => client.email
                ? 'A@' + client.email
                : (client.invitation ? 'I@' : 'Z@') + client.nom),
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    /**
     * Si géré par le client et nouveau, activation.
     * Si géré par le client et actif, edition inactif ou rien?.
     * Si géré par le fournisseur et actif, edition actif.
     * Si géré par le fournisseur et fermé, edition inactif.
     */
    action1(): IKfVueTableColonneDef<Client> {
        return {
            nom: 'action1',
            créeContenu: (client: Client) => {
                if (client.etat === IdEtatRole.nouveau) {
                    return this.utile.bouton.active(client);
                }
                const lien = this.utile.lien.edite(client);
                lien.inactivité = !!client.email || client.etat !== IdEtatRole.actif;
                return lien;
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    /**
     * Si géré par le client et nouveau, suppression.
     * Si géré par le client et actif, inactivation.
     * Si géré par le client et inactif ou fermé, activation.
     * Si géré par le fournisseur et actif, si vide suppression, sinon fermeture.
     * Si géré par le fournisseur et fermé, activation.
     */
    action2(rafraichitComponent?: (rétabli?) => void): IKfVueTableColonneDef<Client> {
        return {
            nom: 'action2',
            créeContenu: (client: Client) => {
                switch (client.etat) {
                    case IdEtatRole.nouveau:
                        return this.utile.bouton.supprime(client, rafraichitComponent);
                    case IdEtatRole.actif:
                        if (!client.email && !client.avecDocuments) {
                            return this.utile.bouton.supprime(client, rafraichitComponent);
                        }
                        return this.utile.bouton.inactive(client);
                    case IdEtatRole.inactif:
                    case IdEtatRole.fermé:
                        return this.utile.bouton.active(client);
                }
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
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

    colonnes(): IKfVueTableColonneDef<Client>[] {
        return this.colonnesBase().concat([
            this.email(),
            this.action1(),
            this.action2(),
        ]);
    }

}
