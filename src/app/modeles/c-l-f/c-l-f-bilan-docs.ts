import { Client } from "../client/client";
import { apiType, typeCLF, TypeCLF } from "./c-l-f-type";

export class ApiBilanDocs {

    /**
     * Type des documents.
     */
    type: TypeCLF;

    /**
     * Nombre de document.
     */
     nb: number;

     /**
      * Coût total des documents.
      */
     total: number;
 
     /**
      * Présent et vrai quand un des documents a un total incomplet.
      */
     incomplet?: boolean;
 }

 export class ApiClientBilanDocs {
     
    /**
     * Uid du client.
     */
    uid: string;

    /**
     * Rno du client.
     */
    rno: number;

    /**
     * Bilans par type
     */
    bilans: ApiBilanDocs[];

 }
 
export class CLFBilanDocs {

    /**
     * Nombre de document.
     */
     nb: number;

     /**
      * Coût total des documents.
      */
     total: number;
 
     /**
      * Présent et vrai quand un des documents est une commande avec un total incomplet.
      */
     incomplet?: boolean;

     constructor(apiBilanDocs: ApiBilanDocs) {
         if (apiBilanDocs) {
             this.nb = apiBilanDocs.nb;
             this.total = apiBilanDocs.total;
             this.incomplet = apiBilanDocs.incomplet;
         } else {
             this.nb = 0;
             this.total = 0;
         }
     }
 }

 export class CLFClientBilanDocs {
     
    /**
     * Uid du client.
     */
    client: Client;

    /**
     * Bilan des bons de commande.
     */
    commande: CLFBilanDocs;

    /**
     * Bilan des bons de livraison.
     */
    livraison: CLFBilanDocs;

    /**
     * Bilan des factures.
     */
    facture: CLFBilanDocs;

    constructor(clients: Client[], apiClientBilan: ApiClientBilanDocs) {
        this.client = clients.find(c => c.uid === apiClientBilan.uid && c.rno === apiClientBilan.rno);
        this.commande = new CLFBilanDocs(apiClientBilan.bilans.find(a => a.type === apiType('commande')));
        this.livraison = new CLFBilanDocs(apiClientBilan.bilans.find(a => a.type === apiType('livraison')));
        this.facture = new CLFBilanDocs(apiClientBilan.bilans.find(a => a.type === apiType('facture')));
    }

 }