export interface IInvitationKey {
    key: InvitationKey;
}

export class InvitationKey {
    email: string;
    uid: string;
    rno: number;
}
