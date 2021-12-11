import { InvitationDeApi } from './invitation';
import { Role } from '../role/role';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

/**
 * Si dans liste ne contient que
 */
export class Client extends Role {
    email: string;
    /**
     * Fixé lors des lectures mais pas stocké
     */
    invitation?: InvitationDeApi;
    avecDocuments: boolean;

    static deRole(role: Role): Client {
        const client = new Client();
        KeyUidRno.copieKey(role, client);
        Client.copieData(role, client);
        return client;
    }

}
