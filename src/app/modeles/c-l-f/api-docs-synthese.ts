import { KeyId } from "src/app/commun/data-par-key/key-id/key-id";

/**
 * Pour envoyer à l'api la key du client et les numéros des documents à synthétiser
 */
 export class ApiDocumentsSynthèse {
    id: number;
    noDocs: number[];
}
