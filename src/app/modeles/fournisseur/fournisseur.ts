import { KeyUidRno } from "src/app/commun/data-par-key/key-uid-rno/key-uid-rno";
import { KfVueTableLigne } from "src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne";
import { IRoleData, IRoleEtat } from "src/app/modeles/role/role";
import { ISiteData } from "src/app/modeles/site/site";

export class Fournisseur extends KeyUidRno implements ISiteData, IRoleData, IRoleEtat {
    nom: string;
    adresse: string;
    ville: string;
    etat: string;
    date0: Date;
    dateEtat: Date;
    email: string;

    url: string;
    titre: string;

    
    /**
     * Ligne d'une vueTable affichant le produit.
     */
     vueTableLigne?: KfVueTableLigne<Fournisseur>;

}
