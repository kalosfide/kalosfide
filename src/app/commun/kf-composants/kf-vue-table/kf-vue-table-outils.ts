import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfVueTable } from './kf-vue-table';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { IKfVueTableOutilVue, IKfVueTableOutil } from './kf-vue-table-outil';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';
import { KfTypeDEvenement } from '../kf-partages/kf-evenements';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';

export interface IKfVueTableOutils {
    nePasAfficher: boolean;
    outils: IKfVueTableOutilVue[];
    classe: KfNgClasse;
    style: KfNgStyle;
    groupe: KfGroupe;
}

export class KfVueTableOutils<T> extends KfGéreCss implements IKfVueTableOutils {
    private pVueTable: KfVueTable<T>;
    private pOutils: IKfVueTableOutil<T>[];
    /** remplace les lignes quand les filtres ne laissent rien passer */
    texteRienPasseFiltres: string;
    /**
     * Groupe d'affichage des outils
     */
    private pGroupe: KfGroupe;

    private pFiltreChercheALeFocus: boolean;

    constructor() {
        super();
        this.pOutils = [];
        // créer le groupe ici pour pouvoir tout de suite lui ajouter des classes css
        this.pGroupe = new KfGroupe('outils');
        this.texteRienPasseFiltres = `Il n'y aucune ligne correspondant aux critères de filtrage.`;
    }

    get vueTable(): KfVueTable<T> {
        return this.pVueTable;
    }

    initialise(vueTable: KfVueTable<T>) {
        this.pVueTable = vueTable;
        this.suitLaVisiblité(vueTable);
        this.pGroupe.créeGereValeur();
        this.pGroupe.estRacineV = true;
        this.pGroupe.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            () => {
                vueTable.appliqueFiltres();
            });
        this.pOutils.forEach(outil => {
            this.pGroupe.ajoute(outil.composant);
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
     * Définit des classes css à appliquer à la div des outils suivant l'état des filtres.
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

    get groupe(): KfGroupe {
        return this.pGroupe;
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

    get valeurFiltres(): ({ [key: string]: any }) {
        const valeur: { [key: string]: any } = {};
        this.pOutils
            .filter(o => o.valide)
            .map(o => o as KfVueTableFiltreBase<T>)
            .forEach(o => {
                const v = o.valeur
                if (v !== undefined && v !== null) {
                    valeur[o.nom] = o.valeur;
                }
            })
        return valeur;
    }
    set valeurFiltres(valeur: { [key: string]: any }) {
        this.pOutils
            .filter(o => o.valide)
            .map(o => o as KfVueTableFiltreBase<T>)
            .forEach(o => {
                const v = valeur[o.nom];
                if (v !== undefined && v !== null) {
                    o.valeur = v;
                }
            })
    }

    /**
     * Enlève les filtres qui arrêterait une ligne.
     * @param ligne ligne qui doit apparaître dans l'affichage
     * @returns true si un filtre a été modifié
     */
    annuleFiltrePourLigne(ligne: KfVueTableLigne<T>): boolean {
        let filtresChangés = false;
        this.pOutils
            .filter(o => o.valide)
            .map(o => o as KfVueTableFiltreBase<T>)
            .forEach(o => {
                if (!o.valide(ligne)) {
                    o.valeur = undefined;
                    filtresChangés = true
                }
            });
        return filtresChangés;
    }
}
