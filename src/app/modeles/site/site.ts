import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { IdEtatSite } from '../etat-site';

export class Site extends KeyUidRno {
    nomSite: string;
    titre: string;
    ville: string;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
    nbProduits?: number;
    nbClients?: number;
    etat: IdEtatSite;

    constructor(site?: Site) {
        super();
        if (site) {
            this.copie(site);
        }
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
            && site1.nomSite === site2.nomSite
            && site1.titre === site2.titre
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
        this.nomSite = site.nomSite;
        this.titre = site.titre;
        this.ville = site.ville;
        this.formatNomFichierCommande = site.formatNomFichierCommande;
        this.formatNomFichierLivraison = site.formatNomFichierLivraison;
        this.formatNomFichierFacture = site.formatNomFichierFacture;
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
