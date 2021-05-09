import { IInvitationData, InvitationData } from './invitation-data';
import { IInvitationKey, InvitationKey } from './invitation-key';

export class Invitation extends InvitationData implements IInvitationKey {
    email: string;
    // key du site
    uid: string;
    rno: number;

    get key(): InvitationKey {
        return { email: this.email, uid: this.uid, rno: this.rno };
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

    static mêmeClient(invitation1: IInvitationData, invitation2: IInvitationData): boolean {
        return !!invitation1 && !!invitation2
        && invitation1.uidClient === invitation2.uidClient && invitation1.rnoClient === invitation2.rnoClient;
    }
}
