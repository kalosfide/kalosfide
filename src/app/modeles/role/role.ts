import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { TypeCLF } from '../c-l-f/c-l-f-type';
import { Site } from '../site/site';
import { IdEtatRole } from './etat-role';

/**
 * Contient identité et adresse
 */
export interface IRoleData {
    nom: string;
    adresse: string;
    ville: string;
}

export interface IRolePréférences {
    /**
     * Chaînes de caractère où {no} représente le numéro du document et {nom} le nom du client si l'utilisateur est le fournisseur
     * ou du fournisseur si l'utilisateur est le client
     */
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
}

/**
 * Contient état et date de création et de l'état
 */
export interface IRoleEtat {
    etat: string;
    date0: Date;
    dateEtat: Date;
}

export class Role extends KeyUidRno implements IRoleData, IRolePréférences, IRoleEtat {
    nom: string;
    adresse: string;
    ville: string;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
    etat: string;
    date0: Date;
    dateEtat: Date;

    /**
     * Site du role fixé qua
     */
    site: Site;

    constructor(role?: Role) {
        super();
        if (role) {
            KeyUidRno.copieKey(role, this);
            Role.copieData(role, this);
            Role.copiePréférences(role, this);
            Role.copieEtat(role, this);
        }
    }

    static copieData(de: IRoleData, vers: IRoleData) {
        vers.nom = de.nom;
        vers.adresse = de.adresse;
        vers.ville = de.ville;
    }

    static copiePréférences(de: IRolePréférences, vers: IRolePréférences) {
        vers.formatNomFichierCommande = de.formatNomFichierCommande;
        vers.formatNomFichierLivraison = de.formatNomFichierLivraison;
        vers.formatNomFichierFacture = de.formatNomFichierFacture;
    }

    static copieEtat(de: IRoleEtat, vers: IRoleEtat) {
        vers.etat = de.etat;
        vers.date0 = de.date0;
        vers.dateEtat = de.dateEtat;
    }

    static nomFichier(role: Role, type: TypeCLF, no: number, nom: string): string {
        let modèle: string;
        switch (type) {
            case 'commande':
                modèle = role.formatNomFichierCommande;
                break;
            case 'livraison':
                modèle = role.formatNomFichierLivraison;
                break;
            case 'facture':
                modèle = role.formatNomFichierFacture;
                break;
            default:
                return;
        }
        modèle = modèle ? modèle : `{nom} ${type} {no}`;
        return modèle.replace('{no}', '' + no).replace('{nom}', nom);
    }

    get estFournisseur(): boolean {
        return this.uid === this.site.uid && this.rno === this.site.rno;
    }

    get estClient(): boolean {
        return this.uid !== this.site.uid || this.rno !== this.site.rno;
    }

    /**
     * Vérifie que le site du role est accessible à l'utilisateur identifié.
     * @returns true si le role est d'état actif ou si c'est un role de client d'état nouveau, false sinon.
     */
    get peutEtrePris(): boolean {
        return this.etat === IdEtatRole.actif || (this.estClient && this.etat === IdEtatRole.nouveau)
    }
}
