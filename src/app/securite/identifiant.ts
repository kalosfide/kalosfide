import { ISiteData, ISiteEtat, Site } from '../modeles/site/site';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IRoleData, IRoleEtat, IRolePréférences, Role } from '../modeles/role/role';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { SiteBilan } from '../modeles/site/site-bilan';
import { ApiDoc } from '../modeles/c-l-f/api-doc';
import { IdEtatRole } from '../modeles/role/etat-role';

export class JwtIdentifiant {
    /**
     * userId
     */
    Id: string;
    Jeton: string;
    ExpireDans: number;
}

interface IRole extends IRoleData, IRolePréférences, IRoleEtat {
    rno: number;
    site: ISite;
}
interface ISite extends IKeyUidRno, ISiteData, ISiteEtat {
    fournisseur: IRoleData;
    bilan: SiteBilan;
    nouveauxDocs: ApiDoc[];
}

class ApiFournisseur implements IRoleData {
    nom: string;
    adresse: string;
    ville: string;
}

class ApiSite extends KeyUidRno implements ISiteData {
    url: string;
    titre: string;
    ouvert: boolean;
    dateCatalogue: Date;
    bilan: SiteBilan;
    fournisseur: ApiFournisseur;
    nouveauxDocs: ApiDoc[];
}

class ApiRole implements IRole {
    rno: number;
    nom: string;
    adresse: string;
    ville: string;
    etat: string;
    date0: Date;
    dateEtat: Date;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
    site: ApiSite;
}

class ApiNouveauSite implements IRoleData, ISiteData {
    nom: string;
    adresse: string;
    ville: string;
    url: string;
    titre: string;
}

interface IIdentifiant {
    userId: string;
    email: string;
    uid: string;
    etat: string;
    noDernierRole: number;
}
export class ApiIdentifiant implements IIdentifiant {
    userId: string;
    email: string;
    uid: string;
    etat: string;
    roles: ApiRole[];
    noDernierRole: number;
    nouveauSite: ApiNouveauSite;
}

export class Identifiant implements IIdentifiant {
    userId: string;
    email: string;
    uid: string;
    etat: string;
    roles: Role[];
    noDernierRole: number;
    rnoRoleEnCours: number;

    private static _copie(de: IIdentifiant, vers: IIdentifiant) {
        vers.userId = de.userId;
        vers.email = de.email;
        vers.uid = de.uid;
        vers.etat = de.etat;
        vers.noDernierRole = de.noDernierRole;
    }

    private static créeRole(uid: string, apiRole: IRole): Role {
        const role = new Role();
        role.uid = uid;
        role.rno = apiRole.rno;
        Role.copieData(apiRole, role);
        Role.copiePréférences(apiRole, role);
        Role.copieEtat(apiRole, role);
        role.site = new Site();
        KeyUidRno.copieKey(apiRole.site, role.site);
        Site.copieData(apiRole.site, role.site);
        Site.copieEtat(apiRole.site, role.site);
        role.site.bilan = apiRole.site.bilan;
        role.site.fournisseur = apiRole.site.fournisseur
        role.site.nouveauxDocs = apiRole.site.nouveauxDocs;
        return role
    }

    private static créeNouveauRole(uid: string, rno: number, nouveauSite: ApiNouveauSite): Role {
        const role = new Role();
        role.uid = uid;
        role.rno = rno;
        Role.copieData(nouveauSite, role);
        role.etat = IdEtatRole.nouveau;
        role.site = new Site();
        role.site.uid = uid;
        role.site.rno = rno;
        Site.copieData(nouveauSite, role.site);
        return role
    }

    public static àStocker(apiIdentifiant: ApiIdentifiant): Identifiant {
        const créé = new Identifiant();
        Identifiant._copie(apiIdentifiant, créé);
        créé.roles = apiIdentifiant.roles.map(apiRole => {
            const role = Identifiant.créeRole(apiIdentifiant.uid, apiRole);
            if (apiRole.site.nouveauxDocs) {
                if (role.estFournisseur) {
                    role.site.nouveauxDocs.forEach(apiDoc => {
                        apiDoc.type = 'C';
                    });
                } else {
                    role.site.nouveauxDocs.forEach(apiDoc => {
                        apiDoc.uid = role.uid;
                        apiDoc.rno = role.rno;
                    });
                }
            }
            return role;
        });
        créé.rnoRoleEnCours = créé.noDernierRole;
        if (apiIdentifiant.nouveauSite) {
            créé.roles.push(Identifiant.créeNouveauRole(créé.uid, créé.roles.length + 1, apiIdentifiant.nouveauSite));
        }
        return créé;
    }

    public static deStock(identifiant: Identifiant): Identifiant {
        const créé = new Identifiant();
        Identifiant._copie(identifiant, créé);
        créé.roles = identifiant.roles.map(role => Identifiant.créeRole(identifiant.uid, role));
        créé.rnoRoleEnCours = identifiant.rnoRoleEnCours;
        return créé;
    }

    /**
     * Compare les utilisateurs de deux identifiants.
     * @returns true si les deux identifiants sont undefined ou null ou s'ils ont le même utilisateur.
     */
    public static MêmeUtilisateur(identifiant1: Identifiant, identifiant2: Identifiant): boolean {
        return !identifiant1
            ? !identifiant2
            : !!identifiant2 && identifiant1.uid === identifiant2.uid;
    }

    /**
     * Compare les roles en cours de deux identifiants qui ont le même utilisateur.
     * @returns true si les deux identifiants sont undefined ou null ou s'ils ont le même utilisateur avec le même role.
     */
    public static MêmeRole(identifiant1: Identifiant, identifiant2: Identifiant): boolean {
        return !identifiant1 // identifiant2 est aussi undefined ou null
            || identifiant1.rnoRoleEnCours === identifiant2.rnoRoleEnCours;
    }

    /**
     * Compare les sites en cours de deux identifiants qui ont le même utilisateur dans le même role.
     * @returns true si les deux identifiants sont undefined ou null ou s'ils ont le même utilisateur avec le même role
     * avec le site dans le même état.
     */
    public static MêmeSite(identifiant1: Identifiant, identifiant2: Identifiant): boolean {
        if (!identifiant1) {
            // identifiant2 est aussi undefined ou null
            return true;
        }
        const role = Identifiant.roleEnCours(identifiant1);
        if (!role) {
            // identifiant2.dernierRole() est aussi undefined ou null
            return true;
        }
        const site1 = role.site;
        const site2 = Identifiant.roleEnCours(identifiant2).site;
        return Site.ontMêmeData(site1, site2) && Site.ontMêmeEtat(site1, site2);
    }

    public static roleEnCours(identifiant: Identifiant): Role {
        if (identifiant) {
            return identifiant.roles.find(r => r.rno === identifiant.rnoRoleEnCours);
        }
    }

    public static siteEnCours(identifiant: Identifiant): Site {
        if (identifiant) {
            const role = identifiant.roles.find(r => r.rno === identifiant.rnoRoleEnCours);
            if (role) {
                return role.site;
            }
        }
    }

    public get rolesAccessibles(): Role[] {
        return this.roles.filter(r => r.peutEtrePris);
    }

    get estAdministrateur(): boolean {
        return this.roles.length === 0;
    }
}
