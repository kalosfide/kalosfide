import { IKeyId } from 'src/app/commun/data-par-key/key-id/i-key-id';
import { Client } from './client';

export class InvitationData {
    email: string;
    idClient: number;

    static copie(de: InvitationData, vers: InvitationData) {
        vers.email = de.email;
        vers.idClient = de.idClient;
    }
}

export class InvitationDeApi extends InvitationData {
    date: Date;
}

export class InvitationVersApi extends InvitationData {
    // key du site
    id: number;

    static nouveau(invitation: Invitation, keySite: IKeyId): InvitationVersApi {
        const nouveau = new InvitationVersApi();
        nouveau.id = keySite.id;
        InvitationData.copie(invitation, nouveau);
        return nouveau;
    }
}

export class Invitation extends InvitationDeApi {
    client: Client;

    // Id du site
    id: number;

    static nouveau(invitationData: InvitationDeApi): Invitation {
        const nouveau = new Invitation();
        nouveau.date = new Date(invitationData.date);
        nouveau.email = invitationData.email;
        nouveau.idClient = invitationData.idClient;
        return nouveau;
    }

    static créeParamsKey(invitation: Invitation): { [key: string]: string } {
        const params: { [key: string]: string } = {};
        params.email = invitation.email;
        params.id = '' + invitation.id;
        return params;
    }

    static créeParamsEnvoi(invitation: Invitation): { [key: string]: string } {
        const params = Invitation.créeParamsKey(invitation);
        if (invitation.idClient) {
            params.idClient = '' + invitation.idClient;
        }
        params.date = (new Date(invitation.date)).toDateString();
        return params;
    }

    static mêmeClient(invitation1: InvitationData, invitation2: InvitationData): boolean {
        return !!invitation1 && !!invitation2 && invitation1.idClient === invitation2.idClient;
    }

    get nomClient(): string {
        return this.client ? this.client.nom : 'un client';
    }
}
