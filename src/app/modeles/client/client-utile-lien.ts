import { ClientUtile } from './client-utile';
import { Client } from './client';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Invitation } from './invitation';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';

export class ClientUtileLien extends DataUtileLien {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this.parent as ClientUtile;
    }

    index(): KfLien {
        return this.utile.lienKey.index();
    }
    retourIndex(t: Client): KfLien {
        return this.utile.lienKey.retourIndex(t);
    }
    ajoute(): KfLien {
        return this.utile.lienKey.ajoute();
    }

    accepte(client?: Client): KfLien {
        const urlDef = client ? this.utile.url.accepte(client) : undefined;
        return Fabrique.lien.bouton(this.def('', urlDef, Fabrique.contenu.activer));
    }

    exclut(client?: Client): KfLien {
        const urlDef = client ? this.utile.url.exclut(client) : undefined;
        return Fabrique.lien.bouton(this.def('', urlDef, Fabrique.contenu.fermer));
    }

    supprime(client?: Client): KfLien {
        const urlDef = client ? this.utile.url.exclut(client) : undefined;
        return Fabrique.lien.bouton(this.def('', urlDef, Fabrique.contenu.supprime));
    }

    // liens de table
    edite(client?: Client): KfLien {
        return this.utile.lienKey.edite(client);
    }
    aperçu(t: Client): KfLien {
        return this.utile.lienKey.edite(t);
    }

    invitations(): KfLien {
        return Fabrique.lien.retour(this.utile.url.invitations());
    }
    retourInvitation(invitation?: Invitation): KfLien {
        return Fabrique.lien.retour(invitation
            ? this.utile.url.retourInvitations(invitation)
            : this.utile.url.invitations()
        );
    }
    ajouteInvitationDef(): ILienDef {
        return Fabrique.lien.ajouteDef(this.utile.url.invite(), `Ajouter une invitation`);
    }
    ajouteInvitation(): KfLien {
        return Fabrique.lien.ajoute(this.utile.url.invite(), `Ajouter une invitation`);
    }

    réenvoie(invitation?: Invitation): KfLien {
        const urlDef = invitation ? this.utile.url.réinvite(invitation) : undefined;
        const contenu: IContenuPhraseDef = {
            iconeDef: Fabrique.icone.def.envelope,
            couleurIcone: Couleur.dark,
            texte: 'Réinviter',
            positionTexte: 'bas'
        };
        return Fabrique.lien.bouton(this.def('', urlDef, contenu));
    }

    retourInvitations(invitation: Invitation): KfLien {
        return Fabrique.lien.retour(this.utile.url.retourInvitations(invitation));
    }
    
    invite(client?: Client): KfLien {
        const urlDef = client ? this.utile.url.inviteClient(client) : undefined;
        const contenu: IContenuPhraseDef = {
            iconeDef: Fabrique.icone.def.envelope_pleine,
            couleurIcone: Couleur.dark,
            texte: 'Inviter',
            positionTexte: 'bas'
        };
        return Fabrique.lien.bouton(this.def('', urlDef, contenu));
    }

    invité(clientOuEmail: Client | string): KfLien {
        let urlDef: IUrlDef;
        let email: string;
        if (typeof(clientOuEmail) === 'string') {
            email = clientOuEmail;
        } else {
            urlDef = this.utile.url.inviteClient(clientOuEmail);
            email = clientOuEmail.invitation.email;
        }
        const contenu: IContenuPhraseDef = {
            iconeDef: Fabrique.icone.def.envelope,
            couleurIcone: Couleur.dark,
            texte: email,
            positionTexte: 'bas'
        };
        return Fabrique.lien.bouton(this.def('', urlDef, contenu));
    }
}
