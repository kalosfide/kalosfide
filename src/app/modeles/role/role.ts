import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { TypeCLF } from '../c-l-f/c-l-f-type';
import { Site } from '../site/site';
import { EtatRole } from './etat-role';

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
    etat: EtatRole;
    date0: Date;
    dateEtat: Date;
}

export class Role {
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

    static nomFichier(rolePréférences: IRolePréférences, type: TypeCLF, no: number, nom: string): string {
        let modèle: string;
        switch (type) {
            case 'commande':
                modèle = rolePréférences.formatNomFichierCommande;
                break;
            case 'livraison':
                modèle = rolePréférences.formatNomFichierLivraison;
                break;
            case 'facture':
                modèle = rolePréférences.formatNomFichierFacture;
                break;
            default:
                return;
        }
        modèle = modèle ? modèle : `{nom} ${type} {no}`;
        return modèle.replace('{no}', '' + no).replace('{nom}', nom);
    }
}
