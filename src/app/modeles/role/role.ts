import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { TypeCLF } from '../c-l-f/c-l-f-type';
import { Site } from '../site/site';

export interface IRoleData {
    nom: string;
    adresse: string;
    ville: string;
    etat: string;
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

export class Role extends KeyUidRno implements IRoleData, IRolePréférences {
    nom: string;
    adresse: string;
    ville: string;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;
    etat: string;
    dateEtat: Date;

    site: Site;

    constructor(role?: Role) {
        super();
        if (role) {
            Role.copie(role, this);
        }
    }

    static copieData(de: IRoleData, vers: IRoleData) {
        vers.nom = de.nom;
        vers.adresse = de.adresse;
        vers.ville = de.ville;
        vers.etat = de.etat;
    }

    static copiePréférences(de: IRolePréférences, vers: IRolePréférences) {
        vers.formatNomFichierCommande = de.formatNomFichierCommande;
        vers.formatNomFichierLivraison = de.formatNomFichierLivraison;
        vers.formatNomFichierFacture = de.formatNomFichierFacture;
    }

    static copie(de: Role, vers: Role) {
        vers.uid = de.uid;
        vers.rno = de.rno;
        vers.nom = de.nom;
        vers.adresse = de.adresse;
        vers.ville = de.ville;
        vers.formatNomFichierCommande = de.formatNomFichierCommande;
        vers.formatNomFichierLivraison = de.formatNomFichierLivraison;
        vers.formatNomFichierFacture = de.formatNomFichierFacture;
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
}
