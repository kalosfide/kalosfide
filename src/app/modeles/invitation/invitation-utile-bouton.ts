import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { Invitation } from './invitation';
import { InvitationUtile } from './invitation-utile';

export class InvitationUtileBouton extends DataUtileBouton {

    constructor(utile: InvitationUtile) {
        super(utile);
    }

    get utile(): InvitationUtile {
        return this.dataUtile as InvitationUtile;
    }

    supprime(invitation: Invitation, rafraichitComponent: () => void): KfBouton {
        const titre = `Suppression d'une invitation`;
        const description = new KfEtiquette('');
        description.baliseHtml = KfTypeDeBaliseHTML.p;
        Fabrique.ajouteTexte(description,
            `L'invitation adressée à `,
            {
                texte: invitation.email,
                balise: KfTypeDeBaliseHTML.b
            },
        );
        if (invitation.client) {
            Fabrique.ajouteTexte(description,
                `pour prendre en charge le compte client `,
                {
                    texte: invitation.client.nom,
                    balise: KfTypeDeBaliseHTML.b
                },
            );
        } else {
            Fabrique.ajouteTexte(description,
                `pour créer son compte client `,
            );
        }
        Fabrique.ajouteTexte(description,
            ' va être supprimée.'
        );
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.utile.service.supprime(invitation),
            actionSiOk: () => {
                this.utile.service.quandSupprime(invitation);
                rafraichitComponent();
            },
        };
        const bouton = Fabrique.bouton.attenteDeColonne('supprime' + invitation.email,
            Fabrique.contenu.supprime, apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, [description])
        );
        return bouton;
    }
}
