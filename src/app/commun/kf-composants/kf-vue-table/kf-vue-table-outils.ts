import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfVueTable } from './kf-vue-table';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { IKfVueTableOutilVue, IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnToolbar } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';
import { KfTypeDEvenement } from '../kf-partages/kf-evenements';

export interface IKfVueTableOutils {
    nePasAfficher: boolean;
    outils: IKfVueTableOutilVue[];
    classe: KfNgClasse;
    style: KfNgStyle;
    btnToolbar: KfBBtnToolbar;
}

export class KfVueTableOutils<T> extends KfGéreCss implements IKfVueTableOutils {
    private pVueTable: KfVueTable<T>;
    private pOutils: IKfVueTableOutil<T>[];
    /** remplace les lignes quand les filtres ne laissent rien passer */
    texteRienPasseFiltres: string;
    /**
     * Groupe KfBBtnToolbar d'affichage des outils
     */
    private pBtnToolbar: KfBBtnToolbar;

    private pFiltreChercheALeFocus: boolean;

    constructor() {
        super();
        this.pOutils = [];
        // créer btnToolbar ici pour pouvoir lui ajouter des classes css
        this.pBtnToolbar = new KfBBtnToolbar('outils');
        this.texteRienPasseFiltres = `Il n'y aucune ligne correspondant aux critères de filtrage.`;
    }

    get vueTable(): KfVueTable<T> {
        return this.pVueTable;
    }

    initialise(vueTable: KfVueTable<T>) {
        this.pVueTable = vueTable;
        this.suitLaVisiblité(vueTable);
        this.pBtnToolbar.créeGereValeur();
        this.pBtnToolbar.estRacineV = true;
        this.pBtnToolbar.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            () => {
                vueTable.appliqueFiltres();
            });
        this.pOutils.forEach(outil => {
            this.pBtnToolbar.ajoute(outil.composant);
            if (outil.initialise) {
                outil.initialise(this);
            }
        });
    }

    /**
     * Retourne true si l'un des outils est un filtre des lignes
     */
    get avecFiltre(): boolean {
        for (const outil of this.pOutils) {
            if (outil.valide) {
                return true;
            }
        }
        return false;
    }

    /**
     * Retourne True si l'un des outils filtre les lignes
     */
    get filtreActif(): boolean {
        for (const outil of this.pOutils) {
            if (outil.filtreActif) {
                return true;
            }
        }
        return false;
    }

    get filtreChercheALeFocus(): boolean {
        return this.pFiltreChercheALeFocus;
    }
    quandFiltreCherchePrendLeFocus() {
        this.pFiltreChercheALeFocus = true;
        console.log('FiltreCherchePrendLeFocus');
    }
    quandFiltreCherchePerdLeFocus() {
        this.pFiltreChercheALeFocus = true;
        console.log('FiltreCherchePerdLeFocus');
    }

    /**
     * Définit des classes css à appliquer suivant l'état des filtres.
     * @param siFiltreActif classe css du groupe des outils quand un filtre est actif
     * @param siFiltreInactif classe css du groupe des outils quand aucun filtre n'est actif
     */
    fixeClassesFiltre(siFiltreActif?: string, siFiltreInactif?: string) {
        if (siFiltreActif) {
            this.ajouteClasse({
                nom: siFiltreActif,
                active: () => this.filtreActif
            });
        }
        if (siFiltreInactif) {
            this.ajouteClasse({
                nom: siFiltreInactif,
                active: () => !this.filtreActif
            });
        }
    }

    get btnToolbar(): KfBBtnToolbar {
        return this.pBtnToolbar;
    }

    ajoute(outil: IKfVueTableOutil<T>) {
        this.pOutils.push(outil);
    }

    outil(nom: string): IKfVueTableOutil<T> {
        const outil = this.pOutils.find(f => f.nom === nom);
        return outil;
    }

    get valideLigne(): (ligne: KfVueTableLigne<T>) => boolean {
        const outilsValidants = this.pOutils.filter(outil => outil.valide !== undefined);
        if (outilsValidants.length > 0) {
            return (ligne: KfVueTableLigne<T>) => {
                for (const outil of outilsValidants) {
                    if (!outil.valide(ligne)) {
                        return false;
                    }
                }
                return true;
            };
        }
    }

    get outils(): IKfVueTableOutil<T>[] {
        return this.pOutils;
    }
}
