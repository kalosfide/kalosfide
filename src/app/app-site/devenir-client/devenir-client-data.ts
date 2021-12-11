import { IRoleData } from 'src/app/modeles/role/role';

/**
 * Objet résolu pour la page Devenir client
 */
export class InvitationClient implements IRoleData {
    nom: string;
    adresse: string;
    ville: string;
    code: string;
    url: string;
    titre: string;
}
