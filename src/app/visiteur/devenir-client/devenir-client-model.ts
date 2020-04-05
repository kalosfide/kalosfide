import { ClientData } from 'src/app/modeles/client/client';

export class DevenirClientModel extends ClientData {
    email: string;
    password: string;
    siteUid: string;
    siteRno: number;
}
