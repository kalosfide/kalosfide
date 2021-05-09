import { ISiteData, Site } from '../modeles/site/site';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IRoleData, IRolePréférences, Role } from '../modeles/role/role';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { IdEtatSite } from '../modeles/etat-site';

export class JwtIdentifiant {
    /**
     * userId
     */
    Id: string;
    Jeton: string;
    ExpireDans: number;
}

interface IRole extends IRoleData, IRolePréférences {
    rno: number;
}
interface ISite extends IKeyUidRno, IRoleData, ISiteData {}

class ApiRole implements IRoleData, IRolePréférences {
    rno: number;
    nom: string;
    adresse: string;
    ville: string;
    etat: string;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
}
class ApiSite extends KeyUidRno implements ISiteData, IRoleData {
    nom: string;
    adresse: string;
    ville: string;
    url: string;
    titre: string;
    etat: IdEtatSite;
}
export interface IIdentifiant {
    userId: string;
    userName: string;
    uid: string;
    etat: string;
    roles: IRole[];
    sites: ISite[];
    noDernierRole: number;
}
export class ApiIdentifiant implements IIdentifiant {
    userId: string;
    userName: string;
    uid: string;
    etat: string;
    roles: ApiRole[];
    sites: ApiSite[];
    noDernierRole: number;
}

export class Identifiant implements IIdentifiant {
    userId: string;
    userName: string;
    uid: string;
    etat: string;
    roles: Role[];
    sites: Site[];
    noDernierRole: number;

    private static _copie(de: IIdentifiant, vers: IIdentifiant) {
        vers.userId = de.userId;
        vers.userName = de.userName;
        vers.uid = de.uid;
        vers.etat = de.etat;
        vers.noDernierRole = de.noDernierRole;
        vers.roles = [];
        vers.sites = [];
        for (let index = 0; index < de.roles.length; index++) {
            const deRole = de.roles[index];
            const deSite = de.sites[index];
            const role = new Role();
            role.uid = de.uid;
            role.rno = deRole.rno;
            Role.copieData(deRole, role);
            Role.copiePréférences(deRole, role);
            const site = new Site();
            Site.copieKey(deSite, site);
            Site.copieData(deSite, site);
            Role.copieData(deSite, site);
            role.site = site;
            vers.roles.push(role);
            vers.sites.push(site);
        }
    }

    static crée(apiIdentifiant: ApiIdentifiant): Identifiant {
        const créé = new Identifiant();
        Identifiant._copie(apiIdentifiant, créé);
        for (let index = 0; index < apiIdentifiant.sites.length; index++) {
            const deSite = apiIdentifiant.sites[index];
            const site = créé.sites[index];
            site.etat = deSite.etat;
        }
        return créé;
    }

    static copie(identifiant: Identifiant): Identifiant {
        const créé = new Identifiant();
        Identifiant._copie(identifiant, créé);
        for (let index = 0; index < identifiant.sites.length; index++) {
            const deSite = identifiant.sites[index];
            const site = créé.sites[index];
            site.etat = deSite.etat;
        }
        return créé;
    }

    get urlSiteParDéfaut(): string {
        if (this.roles.length > 0) {
            const role = this.roles.find(r => r.rno === this.noDernierRole);
            return role ? role.site.url : this.roles[0].site.url;
        }
    }

    estAdministrateur(): boolean {
        return this.roles.length === 0;
    }

    roleParUrl(urlSite: string): Role {
        const role = this.roles.find(r => r.site.url === urlSite);
        return role;
    }

    estUsagerDeSiteParUrl(urlSite: string): boolean {
        return this.roleParUrl(urlSite) !== undefined;
    }

    estUsager(site: Site): boolean {
        return this.estUsagerDeSiteParUrl(site.url) !== undefined;
    }

    estFournisseurDeSiteParUrl(urlSite: string): boolean {
        const role = this.roleParUrl(urlSite);
        if (role !== undefined) {
            return this.uid === role.site.uid && role.rno === role.site.rno;
        }
        return false;
    }

    estFournisseur(site: Site): boolean {
       return this.estFournisseurDeSiteParUrl(site.url);
    }

    estClientDeSiteParUrl(urlSite: string): boolean {
        return this.estUsagerDeSiteParUrl(urlSite) && !this.estFournisseurDeSiteParUrl(urlSite);
    }

    estClient(site: Site): boolean {
       return this.estClientDeSiteParUrl(site.url);
    }

    /**
     * Retourne la KeyUidRno du client si l'identifiant est client du site, undefined sinon
     * @param site Site
     */
    keyClient(site: Site): IKeyUidRno {
        const role = this.roleParUrl(site.url);
        if (role !== undefined) {
            if (this.uid !== site.uid || role.rno !== site.rno) {
                return { uid: this.uid, rno: role.rno };
            }
        }
    }
}
