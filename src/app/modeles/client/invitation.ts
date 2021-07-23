import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Client } from './client';

export class InvitationData {
    email: string;
    uidClient: string;
    rnoClient: number;

    static copie(de: InvitationData, vers: InvitationData) {
        vers.email = de.email;
        vers.uidClient = de.uidClient;
        vers.rnoClient = de.rnoClient;
    }
}

export class InvitationDeApi extends InvitationData {
    date: Date;
}

export class InvitationVersApi extends InvitationData {
    // key du site
    uid: string;
    rno: number;

    static nouveau(invitation: Invitation, keySite: IKeyUidRno): InvitationVersApi {
        const nouveau = new InvitationVersApi();
        nouveau.uid = keySite.uid;
        nouveau.rno = keySite.rno;
        InvitationData.copie(invitation, nouveau);
        return nouveau;
    }
}

export class Invitation extends InvitationDeApi {
    client: Client;

    // key du site
    uid: string;
    rno: number;

    static nouveau(invitationData: InvitationDeApi): Invitation {
        const nouveau = new Invitation();
        nouveau.date = new Date(invitationData.date);
        nouveau.email = invitationData.email;
        nouveau.uidClient = invitationData.uidClient;
        nouveau.rnoClient = invitationData.rnoClient;
        return nouveau;
    }

    static créeParamsKey(invitation: Invitation): { [key: string]: string } {
        const params: { [key: string]: string } = {};
        params.email = invitation.email;
        params.uid = invitation.uid;
        params.rno = '' + invitation.rno;
        return params;
    }

    static créeParamsEnvoi(invitation: Invitation): { [key: string]: string } {
        const params = Invitation.créeParamsKey(invitation);
        if (invitation.uidClient) {
            params.uidClient = invitation.uidClient;
            params.rnoClient = '' + invitation.rnoClient;
        }
        params.date = (new Date(invitation.date)).toDateString();
        return params;
    }

    static mêmeClient(invitation1: InvitationData, invitation2: InvitationData): boolean {
        return !!invitation1 && !!invitation2
            && invitation1.uidClient === invitation2.uidClient && invitation1.rnoClient === invitation2.rnoClient;
    }

    get nomClient(): string {
        return this.client ? this.client.nom : 'un client';
    }
}
