import { Client } from '../client/client';

export interface IInvitationData {
    date: Date;
    uidClient: string;
    rnoClient: number;
}

export class InvitationData implements IInvitationData {
    date: Date;
    uidClient: string;
    rnoClient: number;
    client: Client;

    static copie(de: IInvitationData, vers: IInvitationData) {
        vers.date = new Date(de.date);
        vers.uidClient = de.uidClient;
        vers.rnoClient = de.rnoClient;
    }
}
