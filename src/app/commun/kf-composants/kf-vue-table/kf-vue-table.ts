import { FormArray } from '@angular/forms';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant, IKfComposant } from '../kf-composant/kf-composant';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { KfVueTableColonne, IKfVueTableColonne, KfVueTableColonneNuméro } from './kf-vue-table-colonne';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';
import { KfVueTableOutils, IKfVueTableOutils } from './kf-vue-table-outils';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';
import { IKfVueTableDef } from './i-kf-vue-table-def';
import { KfVueTableEnTete } from './kf-vue-table-section-en-tete';
import { IKfVueTablePagination, KfVueTablePagination } from './kf-vue-table-pagination';
import { IKfVueTableLigne } from './kf-vue-table-ligne-base';
import { KfVueTableBilan } from './kf-vue-table-section-bilan';
import { KfVueTableCorps } from './kf-vue-table-section-corps';
import { IKfVueTableSection } from './kf-vue-table-section-base';
import { EventEmitter } from '@angular/core';
import { KfEvenement, KfStatutDEvenement, KfTypeDEvenement } from '../kf-partages/kf-evenements';
import { KfComposantGereHtml } from '../kf-composant/kf-composant-gere-html';
import { IKfVueTableColonneNoLigneDef } from './i-kf-vue-table-colonne-no-ligne-def';
import { KfVueTableNavigationBase } from './kf-vue-table-navigation-base';
import { KfVueTableNavigationParCellule } from './kf-vue-table-navigation-par-cellule';
import { KfVueTableNavigationParLigne } from './kf-vue-table-navigation-par-ligne';

/** pour que le component soit indépendant du générique T */
export interface IKfVueTable extends IKfComposant {
    /**
     * Si défini, une barre d'outils est affichée au dessus de la table
     */
    outils: IKfVueTableOutils;
    /**
     * Si défini, une barre de pagination est affichée au dessous de la table
     */
    pagination: IKfVueTablePagination;
    lignes: IKfVueTableLigne[];
    colonnes: IKfVueTableColonne[];
    avecValeur: boolean;
    superGroupes: KfSuperGroupe[];
    groupesAvecControls: KfGroupe[];
    classe: KfNgClasse;
    style: KfNgStyle;
    enTete: IKfVueTableSection;
    corps: IKfVueTableSection;
    bilan: IKfVueTableSection;
    rienPasseFiltres: boolean;
    /** remplace les lignes quand les filtres ne laissent rien passer */
    texteRienPasseFiltres: string;
    /** colspan du td du texte qui remplace les lignes quand les filtres ne laissent rien passer */
    nbColonnesVisibles: number;
    gereHtml: KfComposantGereHtml;
    initialiseHtml(table: HTMLTableElement, output: EventEmitter<KfEvenement>): void;
    vérifieHtml(): void;
}

export class KfVueTable<T> extends KfComposant implements IKfVueTable {
    private def: IKfVueTableDef<T>;

    /**
     * Si défini, une barre d'outils est affichée au dessus de la table
     */
    private pOutils: KfVueTableOutils<T>;
    /**
     * Si défini, une barre de pagination est affichée au dessous de la table
     */
    private pPagination: KfVueTablePagination<T>;

    /**
     * Colonnes de la table
     */
    private pColonnes: KfVueTableColonne<T>[];

    /**
     * Lignes des items dans l'ordre de leur création
     */
    private pLignes: KfVueTableLigne<T>[];

    /**
     * Lignes dans l'ordre du tri de la colonne de tri. Mis à jour quand un tri est appliqué.
     */
    private pLignesTriées: KfVueTableLigne<T>[];
    /**
     * Lignes dans l'ordre du tri de la colonne de tri. Mis à jour quand un tri est appliqué.
     */
    get lignesTriées(): KfVueTableLigne<T>[] {
        return this.pLignesTriées ? this.pLignesTriées : this.pLignes;
    }

    /**
     * Lignes dans l'ordre du tri de la colonne de tri filtrées par les outils. Mis à jour quand un tri ou un filtre est appliqué.
     */
    private pLignesTriéesFiltrées: KfVueTableLigne<T>[];
    /**
     * Lignes dans l'ordre du tri de la colonne de tri filtrées par les outils. Mis à jour quand un tri ou un filtre est appliqué.
     */
    get lignesTriéesFiltrées(): KfVueTableLigne<T>[] {
        return this.pLignesTriéesFiltrées ? this.pLignesTriéesFiltrées : this.lignesTriées;
    }

    private pEnTete: KfVueTableEnTete<T>;
    private pCorps: KfVueTableCorps<T>
    private pBilan: KfVueTableBilan<T>

    /**
     * Si définie, la table doit être triée suivant le tri défini par cette colonne
     */
    private pColonneDeTri: KfVueTableColonne<T>;

    private pNavigationAuClavier: KfVueTableNavigationBase<T>;

    constructor(nom: string, vueTableDef: IKfVueTableDef<T>) {
        super(nom, KfTypeDeComposant.vuetable);
        this.def = vueTableDef;
        this.pLignes = [];
        this.ajouteClasse('table');
        if (vueTableDef.superGroupe) {
            this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecListe);
        }

        this.créeColonnes(vueTableDef.colonnesDef, vueTableDef.colonneNoLigneDef);

        if (vueTableDef.outils) {
            this.pOutils = vueTableDef.outils;
        }

        if (vueTableDef.colonnesDef.find(c => c.enTeteDef !== undefined) !== undefined) {
            this.pEnTete = new KfVueTableEnTete(this);
        }

        this.pCorps = new KfVueTableCorps(this);

        const bilan = new KfVueTableBilan(this);
        if (bilan.lignes.length > 0) {
            this.pBilan = bilan;
        }

        if (vueTableDef.pagination) {
            this.pPagination = vueTableDef.pagination;
            this.pPagination.initialise(this);
        }

        if (vueTableDef.navigationAuClavier) {
            const def = vueTableDef.navigationAuClavier;
            this.pNavigationAuClavier = def.type === 'lignes'
                ? new KfVueTableNavigationParLigne(this, def)
                : new KfVueTableNavigationParCellule(this, def);
            this.gereHtml.ajouteTraiteur(KfTypeDEvenement.keydown,
                (evenement: KfEvenement) => {
                    if (this.pNavigationAuClavier.traiteToucheEnfoncée(evenement.parametres)) {
                        evenement.statut = KfStatutDEvenement.fini;
                    }
                });
        }

        if (vueTableDef.outils) {
            this.pOutils.initialise(this);
        }
    }

    private créeColonnes(colonnesDef: IKfVueTableColonneDef<T>[], colonneNoLigneDef: IKfVueTableColonneNoLigneDef) {
        const colonnes: KfVueTableColonne<T>[] = [];
        let index0 = 0;
        if (colonneNoLigneDef) {
            colonnes.push(new KfVueTableColonneNuméro<T>(this, colonneNoLigneDef));
            index0++;
        }
        const listeNePasAfficher: {
            io: KfInitialObservable<boolean>,
            colonnes: KfVueTableColonne<T>[]
        }[] = [];
        const listeAfficher: {
            io: KfInitialObservable<boolean>,
            colonnes: KfVueTableColonne<T>[]
        }[] = [];
        for (let index = 0; index < colonnesDef.length; index++) {
            const def = colonnesDef[index];
            const colonne = new KfVueTableColonne<T>(this, def, index + index0);
            colonnes.push(colonne);
            let liste: {
                io: KfInitialObservable<boolean>,
                colonnes: KfVueTableColonne<T>[]
            }[];
            let io: KfInitialObservable<boolean>;
            if (def.nePasAfficherSi) {
                liste = listeNePasAfficher;
                io = def.nePasAfficherSi;
            } else {
                if (def.afficherSi) {
                    liste = listeAfficher;
                    io = def.afficherSi;
                }
            }
            if (liste) {
                let masqueur = liste.find(m => m.io === io);
                if (masqueur) {
                    masqueur.colonnes.push(colonne);
                } else {
                    masqueur = {
                        io,
                        colonnes: [colonne]
                    };
                    liste.push(masqueur);
                }
            }
        }
        this.pColonnes = colonnes;
        listeNePasAfficher.forEach(m => {
            m.colonnes.forEach(colonne => {
                colonne.nePasAfficher = m.io.valeur;
            });
            if (m.io.observable) {
                m.io.observable.subscribe(nePasAfficher => {
                    m.colonnes.forEach(colonne => {
                        colonne.nePasAfficher = nePasAfficher;
                    });
                });
            }
        });
        listeAfficher.forEach(m => {
            m.colonnes.forEach(colonne => {
                colonne.nePasAfficher = !m.io.valeur;
            });
            if (m.io.observable) {
                m.io.observable.subscribe(afficher => {
                    m.colonnes.forEach(colonne => {
                        colonne.nePasAfficher = !afficher;
                    });
                });
            }
        });
    }

    get enTete(): KfVueTableEnTete<T> { return this.pEnTete; }
    get corps(): KfVueTableCorps<T> { return this.pCorps; }
    get bilan(): KfVueTableBilan<T> { return this.pBilan; }

    get colonnes(): KfVueTableColonne<T>[] { return this.pColonnes; }
    get colonneDeTri(): KfVueTableColonne<T> { return this.pColonneDeTri; }
    get avecEnTêtesDeLigne(): boolean { return this.def.avecEnTêtesDeLigne; }
    get superGroupe(): (item: T) => KfSuperGroupe { return this.def.superGroupe; }
    get gereCssLigne(): (item: T) => KfGéreCss { return this.def.gereCssLigne; }
    get composantsAValider(): (item: T) => KfComposant[] { return this.def.composantsAValider; }
    get id(): (item: T) => string { return this.def.id; }
    get nePasMontrerIconeDeTriSiPasTrié(): boolean { return this.def.nePasMontrerIconeDeTriSiPasTrié; }
    get navigationAuClavier(): KfVueTableNavigationBase<T> { return this.pNavigationAuClavier; }

    /**
     * Retrouve la ligne dont l'item à une id donnée.
     * La définition de la vueTable doit avoir une propriété id.
     * @param id id de la ligne
     */
    ligne(id: string): KfVueTableLigne<T> {
        return this.pLignes.find(l => this.def.id(l.item) === id);
    }

    /**
     * définit des classes css à appliquer suivant l'état et l'effet des filtres
     * @param siFiltrée classe css du corps de la table quand des lignes sont arrêtées par les filtres
     * @param siNonFiltrée classe css du corps de la table quand aucune ligne n'est arrêtée par les filtres
     */
    fixeClassesFiltre(siFiltrée?: string, siNonFiltrée?: string) {
        this.pCorps.fixeClassesFiltre(siFiltrée, siNonFiltrée);
    }

    get nblignes(): number {
        return this.pLignes.length;
    }

    get nblignesFiltrées(): number {
        return this.pLignes.filter(l => l.indexFiltré !== -1).length;
    }

    get estFiltrée(): boolean {
        return this.nblignesFiltrées < this.nblignes;
    }
    get rienPasseFiltres(): boolean {
        return this.nblignesFiltrées === 0;
    }
    /** remplace les lignes quand les filtres ne laissent rien passer */
    get texteRienPasseFiltres(): string {
        return this.pOutils ? this.pOutils.texteRienPasseFiltres : '';
    }
    /** colspan du td du texte qui remplace les lignes quand les filtres ne laissent rien passer */
    get nbColonnesVisibles(): number {
        return this.pColonnes.filter(c => !c.nePasAfficher).length;
    }

    get estVide(): boolean { return this.pLignes.length === 0; }

    get outils(): KfVueTableOutils<T> {
        return this.pOutils;
    }

    /** sert à initialiser les controls */
    get groupesAvecControls(): KfGroupe[] {
        const groupes: KfGroupe[] = [];
        if (this.pOutils) {
            groupes.push(this.pOutils.groupe);
        }
        if (this.pPagination) {
            groupes.push(this.pPagination.groupe);
        }
        return groupes;
    }

    /**
     * Si défini, une barre de pagination est affichée au dessous de la table
     */
    get pagination(): KfVueTablePagination<T> {
        return this.pPagination;
    }

    get avecValeur(): boolean {
        return !!this.superGroupe;
    }

    get avecComposantsAValider(): boolean {
        return !!this.composantsAValider;
    }

    get lignes(): KfVueTableLigne<T>[] {
        return this.pLignes;
    }
    set lignes(lignes: KfVueTableLigne<T>[]) {
        this.pLignes = lignes;
    }

    get items(): T[] {
        return this.pLignes.map(l => l.item);
    }

    get superGroupes(): KfSuperGroupe[] {
        return this.pLignes.map(l => l.superGroupe);
    }

    get formArray(): FormArray {
        if (this.avecValeur) {
            return this.gereValeur.abstractControl as FormArray;
        }
    }


    /**
     * Ajoute une ligne pour l'item à la fin de la liste
     * @param item objet à ajouter
     */
    ajouteItem(item: T) {
        const ligne = new KfVueTableLigne<T>(this.pCorps, item, this.pLignes.length);
        this.pLignes.push(ligne);
        if (this.avecValeur) {
            if (this.formArray) {
                this.formArray.push(ligne.formGroup);
            }
        }
        if (this.def.itemRéférenceLigne) {
            this.def.itemRéférenceLigne(item, ligne);
        }
    }

    supprimeItem(index: number) {
        // Supprime la ligne de la liste
        const ligne = this.pLignes.splice(index, 1)[0];
        if (this.formArray) {
            this.formArray.removeAt(index);
        }

        // Met à jour les index des lignes suivantes dans l'ordre des index
        for (let i = index; i < this.pLignes.length; i++) {
            this.pLignes[i].index--;
        }

        // Met à jour les numéros des lignes suivantes dans l'ordre des numéros s'il y a une colonne des numéros
        if (this.def.colonneNoLigneDef) {
            this.pLignes.filter(l => l.no > ligne.no).forEach(l => l.fixeNuméro(l.no - 1));
        }

        // Supprime la ligne de la liste des lignes triées du corps
        this.pCorps.supprimeLigne(ligne);

        // Met à jour la pagination si elle existe
        if (this.pPagination) {
            this.pPagination.quandLigneSupprimée(ligne.indexFiltré);
        }
    }

    videLignes() {
        this.pLignes = [];
        if (this.formArray) {
            this.formArray.clear();
        }
        this.pCorps.fixeLignes();
    }

    /**
     * Fixe la liste des lignes triées en effectuant le tri suivant de la colonne passée en paramètre.
     * @param colonne colonne de tri
     */
    trie(colonne: KfVueTableColonne<T>) {
        // supprime le tri existant si on change de colonne de tri
        if (this.pColonneDeTri && this.pColonneDeTri.nom !== colonne.nom) {
            this.pColonneDeTri.tri.direction = '';
        }
        // fixe la direction de tri
        colonne.tri.directionSuivante();
        // fixe la colonne de tri
        this.pColonneDeTri = colonne;
        // effectue le tri
        this.pCorps.appliqueTri();
        this.fixeLignesVisibles();
    }

    appliqueFiltres() {
        this.pCorps.appliqueFiltres();
        if (this.pNavigationAuClavier) {
            this.pNavigationAuClavier.quandFiltresAppliqués();
        }
        if (this.pPagination) {
            this.pPagination.quandFiltresAppliqués(this.nblignesFiltrées, this.estFiltrée);
        } else {
            this.fixeLignesVisibles();
        }
    }

    fixeLignesVisibles() {
        this.pCorps.fixeLignesVisibles();
        if (this.pBilan) {
            this.pBilan.quandBilanChange();
        }
    }

    /**
     * Remplit la table en créant les lignes et initialise éventuellement la valeur, le tri, les outils, la pagination
     * et la référence de l'item à la ligne
     */
    initialise(items: T[]) {
        this.pLignes = [];
        if (items.length === 0) {
            this.pCorps.fixeLignes();
            return;
        }
        for (const item of items) {
            this.pLignes.push(new KfVueTableLigne<T>(this.pCorps, item, this.pLignes.length));
        }
        if (this.def.itemRéférenceLigne) {
            this.pLignes.forEach(ligne => this.def.itemRéférenceLigne(ligne.item, ligne));
        }
        if (this.formArray) {
            this.formArray.clear();
            this.pLignes.forEach(ligne => this.formArray.push(ligne.formGroup));
        }
        if (this.def.triInitial) {
            this.pColonneDeTri = this.colonnes.find(c => c.nom === this.def.triInitial.colonne);
            this.pColonneDeTri.tri.direction = this.def.triInitial.direction;
        }
        this.pCorps.fixeLignes();

        if (this.def.colonneNoLigneDef) {
            // Fixe le numéro des lignes
            for (let index = 0; index < this.pCorps.lignes.length; index++) {
                this.pCorps.lignes[index].fixeNuméro(index);
            }
        }

        this.appliqueFiltres();
    }

    get quandClic(): { colonneDuClic?: string } | ((item: T) => (() => void)) {
        return this.def.quandClic;
    }

    initialiseHtml(table: HTMLElement, output: EventEmitter<KfEvenement>) {
        const date = new Date(Date.now());
        this.gereHtml.fixeAttribut('init', date.toTimeString());
        if (this.pNavigationAuClavier) {
            // focus sur la première ligne
            this.pNavigationAuClavier.fixeLeFocus();
        }
        this.gereHtml.htmlElement = table;
        this.gereHtml.initialiseHtml(output);
        let childIndex = 0;
        if (this.pEnTete) {
            this.pEnTete.initialiseHtml(table.children[childIndex++] as HTMLElement);
        }
        this.pCorps.initialiseHtml(table.children[childIndex++] as HTMLElement);
        if (this.pBilan) {
            this.pBilan.initialiseHtml(table.children[childIndex] as HTMLElement);
        }
    }

    vérifieHtml() {
        const changé = this.pCorps.vérifieHtml();
        if (this.pNavigationAuClavier && changé) {
            if (!this.pNavigationAuClavier.aLeFocus
                && !(this.pOutils && this.pOutils.filtreChercheALeFocus)) {
                this.pNavigationAuClavier.fixeLeFocus();
            }
        }
    }

    activeLigne(ligne: KfVueTableLigne<T>) {
        // s'il y a une pagination on va à la page de la ligne
        if (this.pPagination) {
            const page = this.pPagination.page(ligne.indexFiltré);
            this.pPagination.vaAPage(page);
        }
        if (this.pNavigationAuClavier) {
            this.pNavigationAuClavier.fixeLigneActive(ligne);
        }
    }

}
