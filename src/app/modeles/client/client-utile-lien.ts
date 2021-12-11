import { ClientUtile } from './client-utile';
import { Client } from './client';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Invitation } from './invitation';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';

export class ClientUtileLien extends DataUtileLien {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this.parent as ClientUtile;
    }

    index(): KfLien {
        return Fabrique.lien.retour(this.utile.url.index());
    }
    retourIndex(t: Client): KfLien {
        return Fabrique.lien.retour(this.utile.url.retourIndex(t));
    }
    ajoute(): KfLien {
        return Fabrique.lien.ajoute(this.utile.url.ajoute());
    }

    // liens de table
    edite(client?: Client): KfLien {
        return Fabrique.lien.bouton(this.def('', this.utile.url.edite(client), Fabrique.contenu.édite()));
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
        return Fabrique.lien.bouton(this.def('', urlDef, Fabrique.contenu.réinviter()));
    }

    retourInvitations(invitation: Invitation): KfLien {
        return Fabrique.lien.retour(this.utile.url.retourInvitations(invitation));
    }
    
    inviter(client?: Client): KfLien {
        const urlDef = client ? this.utile.url.inviteClient(client) : undefined;
        return Fabrique.lien.bouton(this.def('', urlDef, Fabrique.contenu.inviter()));
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
        return Fabrique.lien.bouton(this.def('', urlDef, Fabrique.contenu.invité(email)));
    }
}
