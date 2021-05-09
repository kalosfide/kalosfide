import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { IdEtatSite } from '../etat-site';
import { IRoleData } from '../role/role';

export interface ISiteData {
    url: string;
    titre: string;
}

export class Site extends KeyUidRno implements ISiteData, IRoleData {
    url: string;
    titre: string;
    nom: string;
    adresse: string;
    ville: string;
    nbProduits?: number;
    nbClients?: number;
    etat: IdEtatSite;

    constructor(site?: Site) {
        super();
        if (site) {
            this.copie(site);
        }
    }

    static copieData(de: ISiteData, vers: ISiteData) {
        vers.url = de.url;
        vers.titre = de.titre;
    }

    static compare(site1: Site, site2: Site): boolean {
        if (!site1) {
            return !site2;
        }
        if (!site2) {
            return false;
        }
        return site1.uid === site2.uid
            && site1.rno === site2.rno
            && site1.url === site2.url
            && site1.titre === site2.titre
            && site1.nom === site2.nom
            && site1.nbProduits === site2.nbProduits
            && site1.nbClients === site2.nbClients
            && site1.etat === site2.etat;
    }

    get ouvert(): boolean {
        return this.etat === IdEtatSite.ouvert;
    }

    copie(site: Site) {
        this.uid = site.uid;
        this.rno = site.rno;
        this.url = site.url;
        this.titre = site.titre;
        this.nom = site.nom;
        this.adresse = site.adresse;
        this.ville = site.ville;
        this.nbProduits = site.nbProduits;
        this.nbClients = site.nbClients;
        this.etat = site.etat;
    }
    copieEtat(site: Site) {
        this.etat = site.etat;
    }

    copieNbs(site: Site) {
        this.nbProduits = site.nbProduits;
        this.nbClients = site.nbClients;
    }
}
