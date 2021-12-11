import { KfBBtnGroup } from '../kf-b-btn-group/kf-b-btn-group';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfListeDeroulanteNombre } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfEvenement, KfTypeDEvenement, KfTypeDHTMLEvents } from '../kf-partages/kf-evenements';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse, KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';
import { IKfIconeDef } from '../kf-partages/kf-icone-def';
import { KfStringDef } from '../kf-partages/kf-string-def';
import { KfVueTable } from './kf-vue-table';

export interface IKfVueTablePaginationDef {
    /**
     * Si un membre début, précédent, suivant ou fin est présent, un bouton sera créé avec cette icone.
     */
    icone?: {
        début?: IKfIconeDef,
        précédent?: IKfIconeDef,
        suivant?: IKfIconeDef,
        fin?: IKfIconeDef,
    };
    /**
     * Nombre maximum de boutons de choix de la page sans compter début et fin
     */
    nbBoutons?: number;
    /**
     * Si présent, un composant affichant les nombres de lignes et de pages sera créé.
     * nomLigne est le nom de l'objet affiché dans une ligne de la table. Si absent, 'ligne' est utilisé.
     * nomLignes est le pluriel du nom de l'objet affiché dans une ligne de la table. Si absent, un 's' est ajouté à nomLigne.
     */
    avecEtat?: {
        nomLigne?: string,
        nomLignes?: string,
    };
    /**
     * Choix possibles du nombre de lignes par page.
     * S'il y a plusieurs choix une zone de liste sera ajoutée.
     */
    choixNbParPage?: number[];
    /**
     * Si prédent et vrai, une option sera ajoutée à la zone de liste pour afficher toutes les lignes sur une seule page
     */
    optionToutesLesLignes?: boolean;
    /**
     * Nombre de lignes par page.
     */
    nbParPage: number;
    /**
     * Si présent, la pagination n'est pas affichée s'il n'y a qu'une seule page sauf si l'option toutes les lignes de
     * la zone de liste est sélectionnée.
     */
    nePasAfficherSiUneSeulePage?: boolean;
}

interface BoutonDef {
    index: 'D' | 'P' | 'S' | 'F' | number;
    pageCible: () => number;
    icone?: IKfIconeDef;
    inactivité?: () => boolean;
    activitéLi?: () => boolean;
    visible?: () => boolean;
}

class Bouton {
    index: 'D' | 'P' | 'S' | 'F' | number;
    kfBouton: KfBouton;
    pageCible: () => number;
    ariaLabel: () => string;

    constructor(def: BoutonDef) {
        this.index = def.index;
        this.kfBouton = new KfBouton('page' + def.index);
        this.kfBouton.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        if (def.activitéLi) {
            this.kfBouton.ajouteClasse({ nom: 'active', active: def.activitéLi });
        }
        if (def.inactivité) {
            this.kfBouton.inactivitéFnc = def.inactivité;
        }
        if (def.icone) {
            this.kfBouton.fixeIcone(def.icone);
        } else {
            this.kfBouton.fixeTexte(() => '' + def.pageCible());
            if (def.visible) {
                this.kfBouton.ajouteClasse({ nom: 'kf-invisible', active: () => !def.visible() });
            }
        }
        this.pageCible = def.pageCible;
    }

    ajouteClasse(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        this.kfBouton.ajouteClasse(...classeDefs);
    }

    rafraichit() {
        if (!this.kfBouton.icone) {
            this.kfBouton.fixeTexte(() => '' + this.pageCible());
        }
    }
}

class Boutons<T> {
    bbtnGroup: KfBBtnGroup;

    /**
     * Boutons ayant un button dans le bbtGroup.
     */
    boutons: Bouton[];

    quandClic: (bouton: Bouton) => void;


    constructor(parent: KfVueTablePagination<T>) {
        this.bbtnGroup = new KfBBtnGroup('boutons');
        let def: BoutonDef;
        let bouton: Bouton;
        this.boutons = [];
        // début
        if (parent.def.icone.début) {
            def = {
                index: 'D',
                pageCible: () => 1,
                icone: parent.def.icone.début,
                inactivité: () => parent.pageActive === 1
            };
            bouton = new Bouton(def);
            this.bbtnGroup.ajoute(bouton.kfBouton);
            this.boutons.push(bouton);
        }
        // précédent
        if (parent.def.icone.précédent) {
            def = {
                index: 'P',
                pageCible: () => parent.pageActive - 1,
                icone: parent.def.icone.précédent,
                inactivité: () => parent.pageActive === 1
            };
            bouton = new Bouton(def);
            this.bbtnGroup.ajoute(bouton.kfBouton);
            this.boutons.push(bouton);
        }
        // boutons avec numéro de page
        for (let index = 0; index < parent.def.nbBoutons; index++) {
            def = {
                index: index + 1,
                pageCible: () => parent.pagePremierBouton + index,
                activitéLi: () => parent.pageActive === parent.pagePremierBouton + index,
                visible: () => parent.pagePremierBouton + index <= parent.nbPages
            };
            bouton = new Bouton(def);
            this.bbtnGroup.ajoute(bouton.kfBouton);
            this.boutons.push(bouton);
        }
        // suivant
        if (parent.def.icone.suivant) {
            def = {
                index: 'S',
                pageCible: () => parent.pageActive + 1,
                icone: parent.def.icone.suivant,
                inactivité: () => parent.nbPages === 0 || parent.pageActive === parent.nbPages
            };
            bouton = new Bouton(def);
            this.bbtnGroup.ajoute(bouton.kfBouton);
            this.boutons.push(bouton);
        }
        // fin
        if (parent.def.icone.fin) {
            def = {
                index: 'F',
                pageCible: () => parent.nbPages,
                icone: parent.def.icone.fin,
                inactivité: () => parent.nbPages === 0 || parent.pageActive === parent.nbPages
            };
            bouton = new Bouton(def);
            this.bbtnGroup.ajoute(bouton.kfBouton);
            this.boutons.push(bouton);
        }

        this.bbtnGroup.gereHtml.ajouteTraiteur(KfTypeDEvenement.click,
            (evenement: KfEvenement) => {
                const boutonCliqué = this.boutons.find(b => b.kfBouton.nom === evenement.emetteur.nom);
                parent.vaAPageEtActivePremièreLigne(boutonCliqué.pageCible());
                switch (boutonCliqué.index) {
                    case 'D':
                    case 'P':
                    case 'S':
                    case 'F':
                        const boutonActif = this.boutons.find(b => b.index === parent.pageActive - parent.pagePremierBouton + 1);
                        boutonActif.kfBouton.prendLeFocus();
                        break;
                    default:
                        break;
                }
            });
        this.quandClic = (boutonCliqué: Bouton) => {
            parent.vaAPageEtActivePremièreLigne(boutonCliqué.pageCible());
            switch (boutonCliqué.index) {
                case 'D':
                case 'P':
                case 'S':
                case 'F':
                    const boutonActif = this.boutons.find(b => b.index === parent.pageActive - parent.pagePremierBouton + 1);
                    boutonActif.kfBouton.prendLeFocus();
                    break;
                default:
                    break;
            }
        };
    }

    rafraichit() {
        this.boutons.forEach(b => b.rafraichit());
    }
}

class Etat {
    bbtnGroup: KfBBtnGroup;
    etiquette: KfEtiquette;

    constructor() {
        this.bbtnGroup = new KfBBtnGroup('etat');
        this.etiquette = new KfEtiquette('');
        this.bbtnGroup.ajoute(this.etiquette);
    }

    fixeTexte(texte: string) {
        this.etiquette.fixeTexte(texte);
    }
}

/**
 * Affiche la liste des options de nombre de lignes par page éventuellement contenu dans une div.
 */
class ChoixNbParPage<T> {
    /**
     * Liste des options de nombre de lignes par page
     */
    liste: KfListeDeroulanteNombre;
    private géreCssDiv: KfGéreCss;

    constructor(parent: KfVueTablePagination<T>) {
        this.liste = new KfListeDeroulanteNombre('nbParPage');
        this.liste.estRacineV = true;
        parent.def.choixNbParPage.forEach(nb => {
            this.liste.créeEtAjouteOption(`${nb} lignes par page`, nb);
        });
        if (parent.def.optionToutesLesLignes) {
            this.liste.créeEtAjouteOption('une seule page', 0);
        }
        this.liste.valeur = parent.def.nbParPage;
        this.liste.gereHtml.suitLaValeur();
        this.liste.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            () => {
                parent.quandChoixNbParPageChange();
            });
    }

    get optionUneSeulePageChoisie(): boolean {
        return this.liste.valeur === 0;
    }

    ajouteClasseDiv(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.géreCssDiv) {
            this.géreCssDiv = new KfGéreCss();
        }
        this.géreCssDiv.ajouteClasse(...classeDefs);
    }

    get classeDiv(): KfNgClasse {
        if (this.géreCssDiv) {
            return this.géreCssDiv.classe;
        }
    }
}

export interface IKfVueTablePagination {
    groupe: KfGroupe;
}

export class KfVueTablePagination<T> implements IKfVueTablePagination {

    def: IKfVueTablePaginationDef;
    /**
     * Nombre de lignes par page. Mis à jour quand la valeur de choixNbParPage change.
     */
    nbParPage: number;

    /**
     * Nombre total de pages. Mis à jour quand le nombre de lignes de la vueTable change.
     */
    nbPages: number;

    /**
     * Nombre de lignes à répartir dans les pages. Mis à jour quand le nombre de lignes de la vueTable change.
     */
    nbLignes: number;

    /**
     * Vrai si un filtre est appliqué à la vueTable
     */
    estFiltrée: boolean;

    /**
     * Numéro de la page active, celle dont les lignes sont affichées.
     */
    pageActive: number;

    /**
     * Numéro de la page du premier bouton numéroté
     */
    pagePremierBouton: number;

    /**
     * Boutons à icone pour aller au début ou à la page précédente.
     */
    boutons: Boutons<T>;

    /**
     * Composant affiché à gauche montrant dans une div
     */
    etat: Etat;

    private rafraichitEtat: () => void;

    /**
     * Liste du choix du nombre de lignes par page
     */
    choixNbParPage: ChoixNbParPage<T>;

    groupe: KfGroupe;

    vueTable: KfVueTable<T>;

    constructor(def: IKfVueTablePaginationDef) {
        this.def = def;
        this.pageActive = 1;
        this.pagePremierBouton = 1;
        this.nbParPage = def.nbParPage;

        this.groupe = new KfGroupe('pagination');

        if (def.avecEtat) {
            this.etat = new Etat();
            this.groupe.ajoute(this.etat.bbtnGroup);
            const nomLigne = def.avecEtat.nomLigne ? def.avecEtat.nomLigne : 'ligne';
            const nomLignes = def.avecEtat.nomLignes ? def.avecEtat.nomLignes : nomLigne + 's';
            this.rafraichitEtat = () => {
                let texte = `${this.nbLignes} ${this.nbLignes === 1 ? nomLigne : nomLignes} `;
                if (this.estFiltrée) {
                    texte += `(sur ${this.vueTable.nblignes}) `;
                }
                texte += `dans ${this.nbPages} pages`;
                this.etat.etiquette.fixeTexte(texte);
            }
                }

        this.boutons = new Boutons(this);
        this.groupe.ajoute(this.boutons.bbtnGroup);

        if (def.choixNbParPage) {
            this.choixNbParPage = new ChoixNbParPage(this);
            this.groupe.ajoute(this.choixNbParPage.liste);
        }
    }

    initialise(vueTable: KfVueTable<T>) {
        this.vueTable = vueTable;
    }

    initialiseNbParPage(nbParPage: number) {
        this.nbParPage = nbParPage;
        if (this.choixNbParPage) {
            this.choixNbParPage.liste.valeur = nbParPage;
        }
    }

    private calculeNbPages(): number {
        const nbPages = this.nbLignes / this.nbParPage;
        let nbPagesInt = Math.round(nbPages);
        if (nbPagesInt < nbPages) {
            nbPagesInt++;
        }
        return nbPagesInt;
    }

    quandChoixNbParPageChange() {
        const nbParPage = this.choixNbParPage.liste.valeur;
        if (nbParPage === 0) {
            // l'option une seule page est sélectionnée
            this.nbParPage = this.nbLignes;
            this.nbPages = 1;
            this.vaAPage(1);
        } else {
            const index = this.vueTable.navigationAuClavier && this.vueTable.navigationAuClavier.ligneActive
                ? this.vueTable.navigationAuClavier.ligneActive.indexFiltré
                : this.indexPremièreLigne(this.pageActive);
            this.nbParPage = nbParPage;
            this.nbPages = this.calculeNbPages();
            this.vaAPage(this.page(index));
        }
        if (this.def.avecEtat) {
            this.rafraichitEtat();
        }
        if (this.def.nePasAfficherSiUneSeulePage) {
            const caché = this.nbPages === 1 // il n'y a qu'une seule page
                && this.choixNbParPage && !this.choixNbParPage.optionUneSeulePageChoisie; // et ce n'est pas par choix
            this.groupe.visible = !caché;
        }
    }

    /**
     * Fixe les paramètres en fonction du nombre total de lignes
     */
    quandFiltresAppliqués(nbLignes: number, estFiltrée?: boolean) {
        this.nbLignes = nbLignes;
        this.estFiltrée = estFiltrée;
        const nbPages = this.calculeNbPages();
        if (nbPages !== this.nbPages) {
            this.nbPages = nbPages;
            const index = this.vueTable.navigationAuClavier && this.vueTable.navigationAuClavier.ligneActive
                ? this.vueTable.navigationAuClavier.ligneActive.indexFiltré
                : this.pageActive
                    ? this.indexPremièreLigne(this.pageActive)
                    : 0;
            this.vaAPage(this.page(index));
        }
        if (this.def.avecEtat) {
            this.rafraichitEtat();
        }
        if (this.def.nePasAfficherSiUneSeulePage) {
            const caché = this.nbPages === 1 // il n'y a qu'une seule page
                && this.choixNbParPage && !this.choixNbParPage.optionUneSeulePageChoisie; // et ce n'est pas par choix
            this.groupe.visible = !caché;
        }
    }

    // S'il y a une pagination, la page active doit changer si elle est supprimée.
    // Cela se produit si la ligne supprimée est la seule ligne de la dernière page
    // et si numéro de la page à afficher après suppression
    /**
     * Met à jour  les paramètres en fonction du nombre total de lignes
     * @param index index de la ligne dans la liste des lignes filtrées et triées
     */
    quandLigneSupprimée(index: number) {
        this.nbLignes--;
        if (this.choixNbParPage && this.choixNbParPage.optionUneSeulePageChoisie) {
            this.nbParPage = this.nbLignes;
            this.nbPages = 1;
        } else {
            // page de la ligne supprimée
            let page = this.page(index);
            const nbPages = this.calculeNbPages();
            if (nbPages < this.nbPages) {
                // la suppression de la ligne entraine la suppression d'une page
                this.nbPages = nbPages;
                if (page > nbPages) {
                    // la ligne supprimée était la seule ligne de la dernière page qui a donc été supprimée
                    page = nbPages;
                }
            }
            this.vaAPage(page);
        }
        if (this.def.avecEtat) {
            this.rafraichitEtat();
        }
        if (this.def.nePasAfficherSiUneSeulePage) {
            const caché = this.nbPages === 1 // il n'y a qu'une seule page
                && this.choixNbParPage && !this.choixNbParPage.optionUneSeulePageChoisie; // et ce n'est pas par choix
            this.groupe.visible = !caché;
        }

    }

    vaAPage(page: number) {
        if (page !== this.pageActive) {
            this.pageActive = page;
        }
        // il faut
        // pagePremierBouton <= pageActive
        // pageActive <= pagePremierBouton + nbBoutonsVisibles - 1
        // pagePremierBouton + nbBoutonsVisibles - 1 <= nbPages
        const nbBoutonsVisibles = this.nbPages < this.def.nbBoutons ? this.nbPages : this.def.nbBoutons;
        let pagePremierBoutonChangée = false;
        if (this.pagePremierBouton > page) {
            this.pagePremierBouton = page;
            pagePremierBoutonChangée = true;
        }
        if (page > this.pagePremierBouton + nbBoutonsVisibles - 1) {
            this.pagePremierBouton = page - nbBoutonsVisibles + 1;
            pagePremierBoutonChangée = true;
        }
        if (this.pagePremierBouton + nbBoutonsVisibles - 1 > this.nbPages) {
            this.pagePremierBouton = this.nbPages - nbBoutonsVisibles + 1;
            pagePremierBoutonChangée = true;
        }
        if (pagePremierBoutonChangée) {
            this.boutons.rafraichit();
        }
        this.vueTable.fixeLignesVisibles();
    }

    vaAPageEtActivePremièreLigne(page: number) {
        this.vaAPage(page);
        if (this.vueTable.navigationAuClavier) {
            this.vueTable.navigationAuClavier.fixeLigneActive(this.vueTable.corps.lignesVisibles[0]);
        }
    }

    vaAPremièrePage() {
        this.vaAPageEtActivePremièreLigne(1);
    }

    vaADernièrePage() {
        this.vaAPageEtActivePremièreLigne(this.nbPages);
    }

    vaAPagePrécédente() {
        if (this.pageActive > 1) {
            this.vaAPageEtActivePremièreLigne(this.pageActive - 1);
        }
    }

    vaAPageSuivante() {
        if (this.pageActive < this.nbPages) {
            this.vaAPageEtActivePremièreLigne(this.pageActive + 1);
        }
    }

    /**
     * Retourne le numéro de la page où apparait une ligne
     * @param index index de la ligne dans la liste des lignes filtrées et triées
     */
    page(index: number): number {
        return Math.round(index / this.nbParPage) + 1;
    }

    /**
     * Index parmi les lignes filtrées de la première ligne de la page
     */
    indexPremièreLigne(page: number): number {
        return (page - 1) * this.nbParPage;
    }

    /**
     * Index parmi les lignes filtrées de la première ligne et de la dernière ligne de la page active
     */
    get indexLignesDansPage(): {
        première: number,
        dernière: number
    } {
        const première = this.indexPremièreLigne(this.pageActive);
        const dernière = première + this.nbParPage - 1;
        return { première, dernière };
    }
}
