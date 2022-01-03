import { KeyId } from "src/app/commun/data-par-key/key-id/key-id";
import { KfVueTableLigne } from "src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne";
import { IRoleData, IRoleEtat, IRolePréférences, Role } from "src/app/modeles/role/role";
import { ISiteData } from "src/app/modeles/site/site";
import { EtatRole } from "../role/etat-role";

export interface IFournisseurData extends IRoleData {
    siret: string;
}

export class Fournisseur extends KeyId implements IRoleData, IRolePréférences, IRoleEtat {
    nom: string;
    adresse: string;
    ville: string;
    siret: string;
    etat: EtatRole;
    date0: Date;
    dateEtat: Date;
    email: string;
    formatNomFichierCommande: string;
    formatNomFichierLivraison: string;
    formatNomFichierFacture: string;

    url: string;
    titre: string;

    static copieData(de: IFournisseurData, vers: IFournisseurData) {
        Role.copieData(de, vers);
        vers.siret = de.siret;
    }
    
    /**
     * Ligne d'une vueTable affichant le Fournisseur.
     */
     vueTableLigne?: KfVueTableLigne<Fournisseur>;

}
