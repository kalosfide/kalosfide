import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { ClientUtile } from './client-utile';
import { ClientUtileUrl } from './client-utile-url';
import { ClientUtileLien } from './client-utile-lien';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Invitation } from './invitation';
import { Client } from './client';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { IdEtatRole } from '../role/etat-role';
import { KfstringDef, KfstringDefs } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-textes';

export class ClientUtileBouton extends DataUtileBouton {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this.dataUtile as ClientUtile;
    }

    get url(): ClientUtileUrl {
        return this.utile.url;
    }

    get lien(): ClientUtileLien {
        return this.utile.lien;
    }

    active(client: Client): KfBouton {
        const contenu = Fabrique.contenu.activer();
        const nom = { texte: client.nom, balise: KfTypeDeBaliseHTML.b };
        let titre = `Activation d'un compte client`;
        const étiquettes: KfEtiquette[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
        étiquette.ajouteTextes(`Le compte `, nom);
        if (client.etat === IdEtatRole.nouveau) {
            // le compte est d'état Nouveau et géré par le client
            const email = { texte: client.email, balise: KfTypeDeBaliseHTML.b };
            if (client.date0 !== client.dateEtat) {
                // le compte existait avant d'être géré par le client
                étiquette.ajouteTextes(`que vous aviez créé et qui est géré par l'utilisateur d'adresse email `);
            } else {
                // le compte a été créé par le client (faux)
                étiquette.ajouteTextes(`créé par l'utilisateur d'adresse email `);
            }
            étiquette.ajouteTextes(email, 'va être activé.');
            étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
            étiquette.ajouteTextes(`Vous devez être sûr que l'adresse email`, email, `est bien celle de `, nom);
            étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
            étiquette.ajouteTextes(
                `Cette action ne pourra pas être annulée.`
            )
        } else {
            // le compte est inactif ou fermé
            étiquette.ajouteTextes(` va être réactivé.`);
            contenu.texte = 'Réactiver';
        }
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.utile.service.active(client),
            actionSiOk: () => {
                this.utile.service.quandActivé(client);
            },
        };
        const bouton = Fabrique.bouton.attenteDeColonne('active' + KeyUidRno.texteDeKey(client),
            contenu, apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, 'primary', étiquettes)
        );
        return bouton;
    }

    inactive(client: Client): KfBouton {
        const contenu = Fabrique.contenu.fermer();
        const nom = { texte: client.nom, balise: KfTypeDeBaliseHTML.b };
        let titre = `Fermeture d'un compte client`;
        const étiquettes: KfEtiquette[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
        étiquette.ajouteTextes(`Le compte `, nom);
        if (client.email) {
            // le compte est géré par le client
            const email = { texte: client.email, balise: KfTypeDeBaliseHTML.b };
            if (client.date0 !== client.dateEtat) {
                // le compte existait avant d'être géré par le client
                étiquette.ajouteTextes(`que vous aviez créé et qui est géré par l'utilisateur d'adresse email `);
            } else {
                // le compte a été créé par le client (faux)
                étiquette.ajouteTextes(`créé par l'utilisateur d'adresse email `);
            }
            étiquette.ajouteTextes(email, 'va être désactivé pour une période de 60 jours après laquelle il sera automatiquement fermé.');
        } else {
            // le compte est géré par le fournisseur
            étiquette.ajouteTextes(` va être fermé.`);
        }
        étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
        étiquette.ajouteTextes(
            `Cette action pourra être annulée en réactivant le compte.`
        )
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.utile.service.active(client),
            actionSiOk: () => {
                this.utile.service.quandActivé(client);
            },
        };
        const bouton = Fabrique.bouton.attenteDeColonne('active' + KeyUidRno.texteDeKey(client),
            contenu, apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, 'warning', étiquettes)
        );
        return bouton;
    }

    supprime(client: Client, rafraichitComponent: (rétabli?: Client) => void): KfBouton {
        let titre = `Suppression d'un compte client`;
        let description: KfstringDef[];
        let action = ' va être supprimé.';
        if (client.etat === IdEtatRole.nouveau) {
            // le compte est d'état Nouveau et géré par le client (faux)
            if (client.date0 !== client.dateEtat) {
                // le compte existait avant d'être géré par le client (faux)
                titre = `Rétablissement d'un ancien compte`;
                description = [`que vous aviez créé et qui est géré par l'utilisateur d'adresse email `];
                action = `va être rétabli tel qu'il était avant que cet utilisateur ne le gére `
                    + `et on ne pourra plus accéder à votre site en utilisant cette adresse email.`;
            } else {
                // le compte a été créé par le client (faux)
                description = [`créé par l'utilisateur d'adresse email `];
            }
            description.push({ texte: client.email, balise: KfTypeDeBaliseHTML.b });
        } else {
            // le compte est géré par le fournisseur et est vide
            description = [`que vous avez créé et qui ne contient pas de documents `];
        }
        const étiquettes: KfEtiquette[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
        étiquette.ajouteTextes(
            `Le compte `,
            {
                texte: client.nom,
                balise: KfTypeDeBaliseHTML.b
            },
            description,
            action
        );
        étiquette = Fabrique.ajouteEtiquetteP(étiquettes);
        étiquette.ajouteTextes(
            `Cette action ne pourra pas être annulée.`
        )
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.utile.service.inactive(client),
            actionSiOk: (créé?: Client) => {
                this.utile.service.quandInactivé(client)(créé);
                rafraichitComponent(créé);
            },
        };
        const bouton = Fabrique.bouton.attenteDeColonne('supprime' + KeyUidRno.texteDeKey(client),
            Fabrique.contenu.supprime(), apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, 'danger', étiquettes)
        );
        return bouton;
    }

    supprimeInvitation(invitation: Invitation, rafraichitComponent: () => void): KfBouton {
        const titre = `Suppression d'une invitation`;
        const description = new KfEtiquette('');
        description.baliseHtml = KfTypeDeBaliseHTML.p;
        description.ajouteTextes(
            `L'invitation adressée à `,
            {
                texte: invitation.email,
                balise: KfTypeDeBaliseHTML.b
            },
        );
        if (invitation.client) {
            description.ajouteTextes(
                `pour prendre en charge le compte client `,
                {
                    texte: invitation.client.nom,
                    balise: KfTypeDeBaliseHTML.b
                },
            );
        } else {
            description.ajouteTextes(
                `pour créer son compte client `,
            );
        }
        description.ajouteTextes(
            ' va être supprimée.'
        );
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.utile.service.supprimeInvitation(invitation),
            actionSiOk: () => {
                this.utile.service.quandSupprimeInvitation(invitation);
                rafraichitComponent();
            },
        };
        const bouton = Fabrique.bouton.attenteDeColonne('supprime' + invitation.email,
            Fabrique.contenu.supprime(), apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, 'warning', [description])
        );
        return bouton;
    }

}
