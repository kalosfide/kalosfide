import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { FournisseurClientPages } from 'src/app/fournisseur/clients/client-pages';
import { Invitation } from './invitation';
import { InvitationUtile } from './invitation-utile';

export class InvitationUtileLien extends DataUtileLien {

    constructor(utile: InvitationUtile) {
        super(utile);
    }

    get utile(): InvitationUtile {
        return this.parent as InvitationUtile;
    }

    index(): IUrlDef {
        return Fabrique.lien.retour(this.utile.url.index());
    }
    ajouteDef(urlSegmentRetour: string): ILienDef {
        return Fabrique.lien.ajouteDef(this.utile.url.invite(urlSegmentRetour), `Ajouter une invitation`);
    }
    ajoute(urlSegmentRetour: string): KfLien {
        return Fabrique.lien.ajoute(this.utile.url.invite(urlSegmentRetour), `Ajouter une invitation`);
    }

    réenvoie(invitation: Invitation): KfLien {
        const urlDef = this.utile.url.invite(FournisseurClientPages.invitations.urlSegment, invitation.client);
        return Fabrique.lien.lien(this.def('', urlDef, Fabrique.contenu.réinvite));
    }

}
