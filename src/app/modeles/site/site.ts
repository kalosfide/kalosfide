import { KeyId } from '../../commun/data-par-key/key-id/key-id';
import { ApiDoc } from '../c-l-f/api-doc';
import { Client } from '../client/client';
import { Fournisseur } from '../fournisseur/fournisseur';
import { IRoleData, IRoleEtat } from '../role/role';
import { SiteBilan } from './site-bilan';

/**
 * Contient url et titre
 */
export interface ISiteData {
    url: string;
    titre: string;
}

/**
 * Contient ouvert et dateCatalogue
 */
export interface ISiteEtat {
    ouvert: boolean;
    dateCatalogue: Date;
}

export class SiteFournisseur implements IRoleData {
    nom: string;
    adresse: string;
    ville: string;
}

export class Site extends KeyId implements ISiteData, ISiteEtat {
    url: string;
    titre: string;
    ouvert: boolean;
    dateCatalogue: Date;

    /**
     * Présent si l'utilisateur est le fournisseur du site ou l'administrateur.
     */
    bilan: SiteBilan;

    /**
     * Fournisseur du Site.
     */
    fournisseur: Fournisseur;

    /**
     * Client du Site. Présent si l'utilisateur est un client du site
     */
    client: Client;

    /**
    * Documents enregistrés depuis la dernière déconnection.
    * Présent si l'utilisateur s'est déconnecté à la fin de sa session précédente.
    */
    nouveauxDocs: ApiDoc[];

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

    static copieEtat(de: ISiteEtat, vers: ISiteEtat) {
        vers.ouvert = de.ouvert;
        vers.dateCatalogue = de.dateCatalogue;
    }

    static ontMêmeData(isite1: ISiteData, isite2: ISiteData) {
        return isite1.url === isite2.url && isite1.titre === isite2.titre;
    }

    static ontMêmeEtat(isite1: ISiteEtat, isite2: ISiteEtat) {
        return isite1.ouvert === isite2.ouvert && isite1.dateCatalogue === isite2.dateCatalogue;
    }

    copie(site: Site) {
        this.id = site.id;
        this.url = site.url;
        this.titre = site.titre;
        this.fournisseur = site.fournisseur;
        this.bilan = site.bilan;
        this.ouvert = site.ouvert;
        this.dateCatalogue = site.dateCatalogue;
    }
}
