import { IRoleData } from 'src/app/modeles/role/role';

export class DevenirClientModel implements IRoleData {
    nom: string;
    adresse: string;
    ville: string;
    email: string;
    password: string;
    code: string;
}
