import { IRoleData } from 'src/app/modeles/role/role';
import { ISiteData } from 'src/app/modeles/site/site';

export class NouveauSite implements IRoleData, ISiteData {
    url: string;
    titre: string;
    nom: string;
    adresse: string;
    ville: string;
    email: string;
    password: string;
    code: string;
}
