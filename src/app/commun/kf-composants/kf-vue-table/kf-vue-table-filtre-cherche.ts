import { KfClavierTouche } from '../kf-partages/kf-clavier/kf-clavier-touche';
import { KfInputTexte } from '../kf-elements/kf-input/kf-input-texte';
import { KfTexte } from '../kf-elements/kf-texte/kf-texte';
import { KfTypeDHTMLEvents, KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfVueTableOutils } from './kf-vue-table-outils';

export class KfVueTableFiltreCherche<T> extends KfVueTableFiltreBase<T> {
    private pTexte: KfInputTexte;

    /**
     * 
     * @param nom nom du filtre
     * @param colonne nom de la colonne où chercher
     * @param classeEclairé si présent, classe css à appliquer aux morceaux des contenus des cellules semblables au texte recherché
     */
    constructor(nom: string, colonne: string, classeEclairé?: string) {
        super(nom);
        const valide: (kftexte: KfTexte) => boolean = classeEclairé
        ? (kftexte: KfTexte) => kftexte.éclairage(this.pTexte.valeur, classeEclairé)
        : (kftexte: KfTexte) => kftexte.texte.toLowerCase().includes(this.pTexte.valeur.toLowerCase());
        this.pValide = (ligne: KfVueTableLigne<T>) => {
            const cellule = ligne.cellulesVisibles.find(c => c.colonne.nom === colonne);
            const kftexte = cellule.contenu as KfTexte;
            return valide(kftexte)
        };

        this.pTexte = new KfInputTexte(nom + '_T');
    }

    get texte(): KfInputTexte {
        return this.pTexte;
    }

    get composant(): KfInputTexte {
        return this.pTexte;
    }

    initialise(parent: KfVueTableOutils<T>) {
        this._initialise(parent);
        if (parent.vueTable.navigationAuClavier) {
            this.pTexte.gereHtml.suitLeFocus(
                () => parent.quandFiltreCherchePrendLeFocus(),
                () => parent.quandFiltreCherchePerdLeFocus()
            );
            this.pTexte.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keydown)
            this.pTexte.gereHtml.ajouteTraiteur(KfTypeDEvenement.keydown,
                (evenement: KfEvenement) => {
                    let traité = false;
                    const event: KeyboardEvent = evenement.parametres;
                    switch (event.key as KfClavierTouche) {
                        case 'Delete':
                            if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                                this.texte.valeur = null;
                                traité = true;
                            }
                            break;
                        case 'Enter':
                            if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                                parent.vueTable.navigationAuClavier.fixeLeFocus();
                                traité = true;
                            }
                            break;
                        default:
                            break;
                    }
                    if (traité) {
                        evenement.statut = KfStatutDEvenement.fini;
                    }
                });
        }
    }
}
