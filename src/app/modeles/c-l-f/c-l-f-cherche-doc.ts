        /// <returns>un CLFChercheDoc contenant la key et le nom du client et la date si le document recherché existe, null sinon</returns>
/**
 * Contient la key et le nom du client et la date d'un document.
 */
export class CLFChercheDoc {
    /**
     * uid du client du document.
     */
    uid: string;
    /**
     * rno du client du document.
     */
    rno: number;
    /**
     * nom du client du document.
     */
    nom: string;
    /**
     * date du document.
     */
    date: Date;
}