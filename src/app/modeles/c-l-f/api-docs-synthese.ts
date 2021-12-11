import { KeyUidRno } from "src/app/commun/data-par-key/key-uid-rno/key-uid-rno";

/**
 * Pour envoyer à l'api la key du client et les numéros des documents à synthétiser
 */
 export class ApiDocumentsSynthèse {
    uid: string;
    rno: number;
    noDocs: number[];
}
