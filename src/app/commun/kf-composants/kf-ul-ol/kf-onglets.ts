import { KfComposant } from "../kf-composant/kf-composant";
import { KfBouton } from "../kf-elements/kf-bouton/kf-bouton";
import { KfGroupe } from "../kf-groupe/kf-groupe";
import { KfTypeDEvenement, KfTypeDHTMLEvents } from "../kf-partages/kf-evenements";
import { KfUlComposant } from "./kf-ul-ol-composant";

export class KfOnglets extends KfUlComposant {
    /**
     * Déclencheur de l'onglet actif
     */
    private déclencheur: KfComposant;
    /**
     * Contenu de l'onglet actif
     */
    private page: KfComposant

    /** 
     * Liste de composants, les déclencheurs, chacun associé à un composant, sa page, dont un seul est actif.
     * Un clic sur un déclencheur le rend actif. Seule la page du déclencheur actif est insérée dans le template.
     */
    constructor(nom: string) {
        super(nom);
    }

    private fixeOnglet(déclencheur: KfComposant, page: KfComposant) {
        déclencheur.ajouteClasse('active');
        déclencheur.gereHtml.fixeAttribut('aria-current', 'page');
        page.nePasAfficher = false;
        this.déclencheur = déclencheur;
        this.page = page;
    }

    private quandClic(déclencheur: KfComposant, page: KfComposant) {
        if (déclencheur === this.déclencheur) {
            return;
        }
        this.déclencheur.supprimeClasse('active');
        this.déclencheur.gereHtml.supprimeAttribut('aria-current');
        this.page.nePasAfficher = true;
        this.fixeOnglet(déclencheur, page);
    }

    /**
     * Ajoute un onglet.
     * @param déclencheur composant cliquable à préparer pour qu'un clic rend l'onglet actif
     * @param page composant du groupe contenant les onglets qui sera présent dans le template quand l'onglet est actif
     * @param actif l'onglet actif est le dernier des onglets ajoutés pour lequel ce paramètre est true s'il y en a, sinon le premier onglet ajouté 
     */
    ajouteOnglet(déclencheur: KfComposant, page: KfComposant, actif?: boolean) {
        déclencheur.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        déclencheur.gereHtml.ajouteTraiteur(KfTypeDEvenement.click,
            (() => this.quandClic(déclencheur, page)).bind(this)
        );
        if (!this.déclencheur) {
            this.fixeOnglet(déclencheur, page);
        } else {
            if (actif) {
                this.quandClic(déclencheur, page);
            } else {
                page.nePasAfficher = true;
            }
        }
        this.ajoute(déclencheur)
    }
}