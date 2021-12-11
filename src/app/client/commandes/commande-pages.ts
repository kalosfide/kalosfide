import { PageDef } from 'src/app/commun/page-def';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';

export class CommandePages {

    /**
     * Route: commande/bon/:[NomParam.noDoc]
     * Garde des enfants: RedirigeSiContexteChangé
     * Pas de page.
     */
    static bon: PageDef = {
        path: CLFPages.bon.path,
        title: CLFPages.bon.title,
        titre: CLFPages.bon.titre,
    };

    /**
     * Route: commande/bon/lignes
     * Page des lignes à éditer d'un document.
     * Table des lignes du document avec champs à fixer et éventuellement source, boutons ou liens éventuels: supprimer, copier, annuler.
     * Lien ajouter vers choixProduit.
     */
    static lignes: PageDef = {
        path: CLFPages.lignes.path,
        lien: CLFPages.lignes.lien,
        title: CLFPages.lignes.title,
        titre: CLFPages.lignes.titre,
    };

    /**
     * Route: commande/bon/nouveau
     * Page de création d'une nouvelle commande.
     * Table des lignes du document à copier s'il existe.
     * Boutons créer et éventuellement copier
     */
    static nouveau: PageDef = {
        path: CLFPages.nouveau.path,
        title: CLFPages.nouveau.title,
        titre: 'Nouveau bon de commande'
    };

    /**
     * Route: commande/bon/produit
     * Page de choix du produit d'une ligne à ajouter à une commande.
     */
    static choixProduit: PageDef = {
        path: CLFPages.choixProduit.path,
        title: CLFPages.choixProduit.title,
        titre: CLFPages.choixProduit.titre,
    };

    /**
     * Route: ./ajoute/:[NomParam.noLigne]
     * Page d'édition d'une ligne à ajouter à une commande.
     * Param NomParam.noLigne: no du produit de la ligne
     */
    static ajoute: PageDef = {
        path: CLFPages.ajoute.path,
        title: CLFPages.ajoute.title,
        titre: CLFPages.ajoute.titre,
    };

    /**
     * Route: ./envoi (client).
     * Page de visualisation de la synthèse.
     * Bouton: avant envoi, Enregistrer.
     * Lien: avant envoi, annuler vers ./client/:key/bons; après envoi, vers ./clients
     */
    static envoi: PageDef = {
        path: CLFPages.envoi.path,
        title: CLFPages.envoi.title,
        titre: CLFPages.envoi.titre + ' le bon de commande',
    };

    /**
     * Route: ./annule (client).
     * Page d'annulation de la commande ouverte
     * Bouton: Supprimer.
     * Lien: annuler vers ./client/:key/bons (fournisseur) ou ./ (client).
     */
    static annule: PageDef = {
        path: CLFPages.annule.path,
        title: CLFPages.annule.title,
        titre: CLFPages.annule.titre + ' la commande',
    };

    static contexte: PageDef = {
        path: 'contexte',
        title: 'Arrêt',
        titre: 'Arrêt des commandes',
    };
}
