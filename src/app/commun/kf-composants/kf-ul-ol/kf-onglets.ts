import { KfComposant } from "../kf-composant/kf-composant";
import { KfLien } from "../kf-elements/kf-lien/kf-lien";
import { KfEvenement, KfStatutDEvenement, KfTypeDEvenement, KfTypeDHTMLEvents } from "../kf-partages/kf-evenements";
import { KfUlComposant } from "./kf-ul-ol-composant";

class KfOnglet { déclencheur: KfComposant; page: KfComposant; } 

export class KfOnglets extends KfUlComposant {
    private onglets: KfOnglet[];

    private _index: number;

    /** 
     * Liste de composants, les déclencheurs, chacun associé à un composant, sa page, dont un seul est actif.
     * Un clic sur un déclencheur le rend actif. Seule la page du déclencheur actif est insérée dans le template.
     */
    constructor(nom: string) {
        super(nom);
        this.onglets = [];
        this.pAvecRouterOutlet = true;
    }

    private _activeOnglet(onglet: KfOnglet) {
        onglet.déclencheur.ajouteClasse('active');
        onglet.déclencheur.gereHtml.fixeAttribut('aria-current', 'page');
    }

    private _désactiveOnglet(onglet: KfOnglet) {
        onglet.déclencheur.supprimeClasse('active');
        onglet.déclencheur.gereHtml.supprimeAttribut('aria-current');
    }

    private fixeIndex(index: number) {
        this._désactiveOnglet(this.onglets[this._index]);
        this._index = index;
        this._activeOnglet(this.onglets[this._index]);
    }

    /**
     * Ajoute un onglet.
     * @param déclencheur composant cliquable à préparer pour qu'un clic rend l'onglet actif
     * @param page composant du groupe contenant les onglets qui sera visible quand l'onglet est actif
     * @param actif l'onglet actif est le dernier des onglets ajoutés pour lequel ce paramètre est true s'il y en a, sinon le premier onglet ajouté 
     */
    ajouteOnglet(déclencheur: KfComposant, page: KfComposant, actif?: boolean) {
        const index = this.onglets.length; 
        déclencheur.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        déclencheur.gereHtml.ajouteTraiteur(KfTypeDEvenement.click,
            ((événement: KfEvenement) => {
                if (this._index !== index) {
                    this.fixeIndex(index);
                }
                événement.statut = KfStatutDEvenement.fini;
            }).bind(this)
        );
        page.ajouteClasse({ nom: 'kf-invisible', active: () => this._index !== index });
        const onglet = { déclencheur, page }
        this.onglets.push(onglet);
        if (index === 0) {
            this._index = 0;
            this._activeOnglet(onglet);
        } else {
            if (actif) {
                this.fixeIndex(index);
            }
        }
        this.ajoute(déclencheur)
    }

    ajouteLien(texte: string, path: string): KfLien {
        const lien = new KfLien('', './' + path, texte);
        this.ajoute(lien);
        return lien;
    }

    /**
     * Active un onglet
     * @param nomOuIndex si string, nom de la page; si number, index de l'onglet
     */
    activeOnglet(nomOuIndex: string | number) {
        let index: number;
        if (typeof(nomOuIndex) === 'string') {
            index = this.onglets.findIndex(o => o.page.nom === nomOuIndex);
        } else {
            index = nomOuIndex;
        }
        if (index !== this._index && index > -1 && index < this.onglets.length) {
            this.fixeIndex(index);
        }
    }
}