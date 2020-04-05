import { Site } from '../modeles/site/site';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';

export class JwtIdentifiant {
    Id: string;
    Jeton: string;
    ExpireDans: number;
}
export class IdentifiantRole {
    rno: number;
    etat: string;
    nomSite: string;

    constructor(iRole: IdentifiantRole) {
        this.copie(iRole);
    }
    copie(iRole: IdentifiantRole) {
        this.rno = iRole.rno;
        this.etat = iRole.etat;
        this.nomSite = iRole.nomSite;
    }
}
export class Identifiant {
    userId: string;
    userName: string;
    uid: string;
    etat: string;
    roles: IdentifiantRole[];
    sites: Site[];
    noDernierRole: number;

    constructor(identifiant: Identifiant) {
        this.copie(identifiant);
    }

    static keyEnCours(identifiant: Identifiant, siteEnCours: Site): IKeyUidRno {
        return identifiant.estUsager(siteEnCours) ? {
            uid: identifiant.uid,
            rno: identifiant.roles.find(r => r.nomSite === siteEnCours.nomSite).rno
        } : null;
    }

    copie(identifiant: Identifiant) {
        this.userId = identifiant.userId;
        this.userName = identifiant.userName;
        this.uid = identifiant.uid;
        this.etat = identifiant.etat;
        this.roles = identifiant.roles.map(role => new IdentifiantRole(role));
        this.sites = identifiant.sites.map(site => new Site(site));
        this.noDernierRole = identifiant.noDernierRole;
    }

    get nomSiteParDéfaut(): string {
        if (this.roles.length > 0) {
            const role = this.roles.find(r => r.rno === this.noDernierRole);
            return role ? role.nomSite : this.roles[0].nomSite;
        }
    }

    estAdministrateur(): boolean {
        return this.roles.length === 0;
    }

    estUsager(site: Site): boolean {
        return !!this.roles.find(role => role.nomSite === site.nomSite);
    }

    estFournisseur(site: Site): boolean {
        return this.uid === site.uid;
    }

    roleNo(site: Site): number {
        if (this.uid === site.uid) {
            return site.rno;
        } else {
            const role = this.roles.find(r => r.nomSite === site.nomSite);
            if (role) {
                return role.rno;
            }
        }
    }

    /**
     * Retourne la KeyUidRno du client si l'identifiant est client du site, undefined sinon
     * @param site Site
     */
    keyClient(site: Site): IKeyUidRno {
        if (this.uid !== site.uid) {
            const role = this.roles.find(r => r.nomSite === site.nomSite);
            if (role) {
                return { uid: this.uid, rno: role.rno };
            }
        }
    }
    estClient(site: Site): boolean {
        return this.keyClient(site) !== undefined;
    }

    estUsagerDeNomSite(nomSite: string): boolean {
        return !!this.roles.find(role => role.nomSite === nomSite);
    }

    estFournisseurDeNomSite(nomSite: string): boolean {
        return !!this.sites.find(site => site.nomSite === nomSite);
    }

    estClientDeNomSite(nomSite: string): boolean {
        return this.estUsagerDeNomSite(nomSite) && !this.estFournisseurDeNomSite(nomSite);
    }
}
