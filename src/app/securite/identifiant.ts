import { ISiteData, ISiteEtat, Site } from '../modeles/site/site';
import { IKeyId } from '../commun/data-par-key/key-id/i-key-id';
import { IRoleData, IRoleEtat, IRolePréférences, Role } from '../modeles/role/role';
import { KeyId } from '../commun/data-par-key/key-id/key-id';
import { SiteBilan } from '../modeles/site/site-bilan';
import { ApiDoc } from '../modeles/c-l-f/api-doc';
import { EtatRole } from '../modeles/role/etat-role';
import { Fournisseur, IFournisseurData } from '../modeles/fournisseur/fournisseur';
import { Client, IClientData } from '../modeles/client/client';

export class JwtIdentifiant {
    /**
     * userId
     */
    Id: string;
    Jeton: string;
    ExpireDans: number;
}

export enum EtatUtilisateur {
    nouveau,
    actif,
    inactif,
    fermé,
}

class ApiFournisseur implements IFournisseurData, IRoleEtat, IRolePréférences {
    nom: string;
    adresse: string;
    ville: string;
    siret: string;

    etat: EtatRole;
    date0: Date;
    dateEtat: Date;

    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
}

class ApiClient extends KeyId implements IClientData, IRoleEtat, IRolePréférences {
    nom: string;
    adresse: string;
    ville: string;
    etat: EtatRole;
    date0: Date;
    dateEtat: Date;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
}

class ApiSite extends KeyId implements ISiteData, ISiteEtat {
    url: string;
    titre: string;
    ouvert: boolean;
    dateCatalogue: Date;
    bilan: SiteBilan;
    fournisseur: ApiFournisseur;
    client: ApiClient;
    nouveauxDocs: ApiDoc[];
}

class ApiNouveauSite implements IRoleData, ISiteData {
    nom: string;
    adresse: string;
    ville: string;
    url: string;
    titre: string;
}

interface IIdentifiantData {
    userId: string;
    email: string;
    etat: string;
    idDernierSite: number;
}
export class ApiIdentifiant implements IIdentifiantData {
    userId: string;
    email: string;
    etat: string;
    idDernierSite: number;
    sites: ApiSite[];
    nouveauSite: ApiNouveauSite;
}

export class IdentifiantStocké extends ApiIdentifiant {
    idSiteEnCours: number;
}

export class Identifiant implements IIdentifiantData {
    userId: string;
    email: string;
    etat: string;
    idDernierSite: number;
    sites: Site[];
    idSiteEnCours: number;

    private static copieData(de: IIdentifiantData, vers: IIdentifiantData) {
        vers.userId = de.userId;
        vers.email = de.email;
        vers.etat = de.etat;
        vers.idDernierSite = de.idDernierSite;
    }

    private static créeFournisseur(apiFournisseur: ApiFournisseur): Fournisseur {
        const fournisseur = new Fournisseur();
        Fournisseur.copieData(apiFournisseur, fournisseur);
        Role.copieEtat(apiFournisseur, fournisseur);
        Role.copiePréférences(apiFournisseur, fournisseur);
        return fournisseur;
    }

    private static créeSite(apiSite: ApiSite): Site {
        const site = new Site();
        site.id = apiSite.id;
        Site.copieData(apiSite, site);
        Site.copieEtat(apiSite, site);
        site.bilan = apiSite.bilan;
        const apiFournisseur: ApiFournisseur = apiSite.fournisseur;
        const fournisseur = new Fournisseur();
        Fournisseur.copieData(apiFournisseur, fournisseur);
        Role.copieEtat(apiFournisseur, fournisseur);
        site.fournisseur = fournisseur;
        const apiClient = apiSite.client;
        if (apiSite.client) {
            const client = new Client();
            client.id = apiClient.id;
            Role.copieData(apiClient, client);
            Role.copieEtat(apiClient, client);
            Role.copiePréférences(apiClient, client);
        } else {
            Role.copiePréférences(apiFournisseur, fournisseur);           
        }
        site.fournisseur = fournisseur;
        site.nouveauxDocs = apiSite.nouveauxDocs;
        return site
    }

    public static àStocker(apiIdentifiant: ApiIdentifiant): Identifiant {
        const àStocker = new Identifiant();
        Identifiant.copieData(apiIdentifiant, àStocker);
        àStocker.sites = apiIdentifiant.sites.map(s => Identifiant.créeSite(s));
        return àStocker;
    }

    /**
     * Compare les utilisateurs de deux identifiants.
     * @returns true si les deux identifiants sont undefined ou null ou s'ils ont le même utilisateur.
     */
    public static MêmeUtilisateur(identifiant1: Identifiant, identifiant2: Identifiant): boolean {
        return !identifiant1
            ? !identifiant2
            : !!identifiant2 && identifiant1.userId === identifiant2.userId;
    }

    /**
     * Compare les idSiteEnCours de deux identifiants qui ont le même utilisateur.
     * @returns true si les deux identifiants sont undefined ou null ou s'ils ont le même utilisateur avec le même idSiteEnCours.
     */
    public static MêmeSite(identifiant1: Identifiant, identifiant2: Identifiant): boolean {
        return !identifiant1 // identifiant2 est aussi undefined ou null
            || identifiant1.idSiteEnCours === identifiant2.idSiteEnCours;
    }

    /**
     * Compare les sites[idSiteEnCours] de deux identifiants qui ont le même utilisateur avec le même idSiteEnCours.
     * @returns true si les deux identifiants sont undefined ou null ou s'ils ont le même utilisateur avec le même idSiteEnCours
     * avec leurs sites[idSiteEnCours] avec les même data et le même état.
     */
    public static SitesIdentiques(identifiant1: Identifiant, identifiant2: Identifiant): boolean {
        if (!identifiant1) {
            // identifiant2 est aussi undefined ou null
            return true;
        }
        const site1 = identifiant1.sites.find(s => s.id === identifiant1.idSiteEnCours);
        if (!site1) {
            // les deux identifiants n'ont pas de site en cours
            return true;
        }
        const site2 = identifiant2.sites.find(s => s.id === identifiant2.idSiteEnCours);
        return Site.ontMêmeData(site1, site2) && Site.ontMêmeEtat(site1, site2);
    }

    public static siteEnCours(identifiant: Identifiant): Site {
        if (identifiant) {
            return identifiant.sites.find(r => r.id === identifiant.idSiteEnCours);
        }
    }

    get estAdministrateur(): boolean {
        return this.sites.length === 0;
    }
}
