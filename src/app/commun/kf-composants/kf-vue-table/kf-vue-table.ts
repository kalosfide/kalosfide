import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant, IKfComposant } from '../kf-composant/kf-composant';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { FormArray, FormGroup } from '@angular/forms';
import { Tri } from '../../outils/tri';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { KfVueTableColonne, IKfVueTableColonne } from './kf-vue-table-colonne';
import { IKfVueTableLigne, KfVueTableLigne, KfVueTableBilan } from './kf-vue-table-ligne';
import { KfNgClasse, KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfVueTableOutils, IKfVueTableOutils } from './kf-vue-table-outils';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';
import { IKfVueTableDef } from './i-kf-vue-table-def';
import { KfVueTableEnTete } from './kf-vue-table-en-tete';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';
import { KfVueTableTrieurs } from './kf-vue-table-trieur';

/** pour que le component soit indépendant du générique T */
export interface IKfVueTable extends IKfComposant {
    outils: IKfVueTableOutils;
    lignes: IKfVueTableLigne[];
    lignesVisibles: IKfVueTableLigne[];
    colonnes: IKfVueTableColonne[];
    avecValeur: boolean;
    valeurs: any[];
    formGroups: FormGroup[];
    lignesEnTete: IKfVueTableLigne[];
    lignesBilan: IKfVueTableLigne[];
    groupeDesOutils: KfGroupe;
    classe: KfNgClasse;
    style: KfNgStyle;
    classeEnTete: KfNgClasse;
    classeCorps: KfNgClasse;
    classeBilan: KfNgClasse;
    rienPasseFiltres: boolean;
    /** remplace les lignes quand les filtres ne laissent rien passer */
    texteRienPasseFiltres: string;
    /** colspan du td du texte qui remplace les lignes quand les filtres ne laissent rien passer */
    nbColonnesVisibles: number;
    avecClic: boolean;
    quandClic(ligne: IKfVueTableLigne): void;
}

export class KfVueTable<T> extends KfComposant implements IKfVueTable {
    private def: IKfVueTableDef<T>;

    private pOutils: KfVueTableOutils<T>;
    private pColonnes: KfVueTableColonne<T>[];
    private pLignes: KfVueTableLigne<T>[];
    private pEnTete: KfVueTableEnTete<T>;
    private pGereCssEnTete: KfGéreCss;
    private pGereCssCorps: KfGéreCss;
    private pLigneBilan: KfVueTableBilan<T>;
    private pLigneBilanDesVisibles: KfVueTableBilan<T>;
    private pGereCssBilan: KfGéreCss;
    private pEnveloppe: KfGéreCss;

    private pChoisie: KfVueTableLigne<T>;
    private pFixeChoisie: (id: string) => KfVueTableLigne<T>;

    private pRemplaceSiVide: KfGroupe;

    trieurs: KfVueTableTrieurs<T>;

    constructor(nom: string, vueTableDef: IKfVueTableDef<T>) {
        super(nom, KfTypeDeComposant.vuetable);
        this.def = vueTableDef;
        this.pLignes = [];
        this.ajouteClasseDef('table');
        if (vueTableDef.superGroupe) {
            this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecListe);
        }

        if (vueTableDef.colonnesDef.find(c => c.tri !== undefined) !== undefined) {
            if (!this.def.optionsDeTrieur) {
                throw new Error(`VueTableDef ${this.nom} sans optionsDeTrieur et colonnes avec tri`);
            }
            this.trieurs = new KfVueTableTrieurs(this, vueTableDef.optionsDeTrieur);
        }

        this.créeColonnes(vueTableDef.colonnesDef);

        if (vueTableDef.outils) {
            this.pOutils = vueTableDef.outils;
            this.pOutils.initialise(this);
        }

        if (vueTableDef.id) {
            this.pFixeChoisie = (id: string) => {
                this.pChoisie = this.pLignes.find(l => this.def.id(l.item) === id);
                return this.pChoisie;
            };
        }

        if (vueTableDef.colonnesDef.find(c => c.enTeteDef !== undefined) !== undefined) {
            this.pEnTete = new KfVueTableEnTete(this);
        }

        const colonnesAvecBilan = vueTableDef.colonnesDef.filter(c => c.bilanDef !== undefined && c.bilanDef !== null);
        if (colonnesAvecBilan.length > 0) {
            this.pLigneBilan = new KfVueTableBilan(this);
            const colonnesAvecVisiblesSeulement = colonnesAvecBilan.filter(
                c => c.bilanDef.titreVisiblesSeulement !== undefined && c.bilanDef.titreVisiblesSeulement !== null
            );
            if (colonnesAvecVisiblesSeulement.length > 0) {
                this.pLigneBilanDesVisibles = new KfVueTableBilan(this, true);
            }
        }
    }

    private créeColonnes(colonnesDef: IKfVueTableColonneDef<T>[]) {
        const colonnes: KfVueTableColonne<T>[] = [];
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
            const colonne = new KfVueTableColonne<T>(this, def, index);
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

    get colonnes(): KfVueTableColonne<T>[] { return this.pColonnes; }
    get avecEnTêtesDeLigne(): boolean { return this.def.avecEnTêtesDeLigne; }
    get superGroupe(): (item: T) => KfSuperGroupe { return this.def.superGroupe; }
    get gereCss(): (item: T) => KfGéreCss { return this.def.gereCss; }
    get composantsAValider(): (item: T) => KfComposant[] { return this.def.composantsAValider; }
    get id(): (item: T) => string { return this.def.id; }

    get index(): number { return this.pChoisie ? this.pChoisie.index : -1; }

    get fixeChoisie(): (id: string) => KfVueTableLigne<T> {
        return this.pFixeChoisie;
    }

    /**
     * définit des classes css à appliquer suivant létat et l'effet des filtres
     * @param siFiltrée classe css du corps de la table quand des lignes sont arrêtées par les filtres
     * @param siNonFiltrée classe css du corps de la table quand aucune ligne n'est arrêtée par les filtres
     */
    fixeClassesFiltre(siFiltrée?: string, siNonFiltrée?: string) {
        if (siFiltrée) {
            this.ajouteClasseCorps({
                nom: siFiltrée,
                active: () => this.estFiltrée
            });
        }
        if (siNonFiltrée) {
            this.ajouteClasseCorps({
                nom: siNonFiltrée,
                active: () => !this.estFiltrée
            });
        }
    }

    get estFiltrée(): boolean {
        return this.pLignes.find(l => !l.passeFiltres) !== undefined;
    }
    get rienPasseFiltres(): boolean {
        return this.pLignes.find(l => l.passeFiltres) === undefined;
    }
    /** remplace les lignes quand les filtres ne laissent rien passer */
    get texteRienPasseFiltres(): string {
        return this.pOutils ? this.pOutils.texteRienPasseFiltres : '';
    }
    /** colspan du td du texte qui remplace les lignes quand les filtres ne laissent rien passer */
    get nbColonnesVisibles(): number {
        return this.pColonnes.filter(c => !c.nePasAfficher).length;
    }

    get remplaceSiVide(): KfGroupe { return this.pRemplaceSiVide; }
    get estVide(): boolean { return this.pLignes.length === 0; }

    ajouteClasseEnTete(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGereCssEnTete) {
            this.pGereCssEnTete = new KfGéreCss();
        }
        this.pGereCssEnTete.ajouteClasseDefArray(classeDefs);
    }

    get gereCssEnTete(): KfGéreCss {
        if (!this.pGereCssEnTete) {
            this.pGereCssEnTete = new KfGéreCss();
        }
        return this.pGereCssEnTete;
    }

    get classeEnTete(): KfNgClasse {
        if (this.pGereCssEnTete) {
            return this.pGereCssEnTete.classe;
        }
    }

    get lignesEnTete(): IKfVueTableLigne[] {
        if (this.pEnTete) {
            return this.pEnTete.lignes;
        }
    }

    ajouteClasseCorps(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGereCssCorps) {
            this.pGereCssCorps = new KfGéreCss();
        }
        this.pGereCssCorps.ajouteClasseDefArray(classeDefs);
    }

    get gereCssCorps(): KfGéreCss { return this.pGereCssCorps; }

    get classeCorps(): KfNgClasse {
        if (this.pGereCssCorps) {
            return this.pGereCssCorps.classe;
        }
    }

    get lignesBilan(): IKfVueTableLigne[] {
        if (this.pLigneBilan) {
            return this.estFiltrée ? [this.pLigneBilanDesVisibles, this.pLigneBilan] : [this.pLigneBilan];
        }
    }

    ajouteClasseBilan(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGereCssBilan) {
            this.pGereCssBilan = new KfGéreCss();
        }
        this.pGereCssBilan.ajouteClasseDefArray(classeDefs);
    }

    get gereCssBilan(): KfGéreCss { return this.pGereCssBilan; }

    get classeBilan(): KfNgClasse {
        if (this.pGereCssBilan) {
            return this.pGereCssBilan.classe;
        }
    }

    get outils(): KfVueTableOutils<T> {
        if (this.pOutils) {
            return this.pOutils;
        }
    }

    /** sert à initialiser les controls */
    get groupeDesOutils(): KfGroupe {
        if (this.pOutils) {
            return this.pOutils.btnToolbar;
        }
    }

    get enveloppe(): KfGéreCss {
        return this.pEnveloppe;
    }

    /** pour mettre un élément div autour des outils */
    set enveloppe(enveloppe: KfGéreCss) {
        this.pEnveloppe = enveloppe;
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

    get lignesVisibles(): IKfVueTableLigne[] {
        return this.pLignes.filter(l => l.passeFiltres);
    }

    get lignesDansLOrdreDesItems(): KfVueTableLigne<T>[] {
        return this.pLignes.sort((l1, l2) => {
            return l1.index < l2.index ? -1 : l1.index === l2.index ? 0 : 1;
        });
    }

    get items(): T[] {
        return this.lignesDansLOrdreDesItems.map(l => l.item);
    }

    get valeurs(): any[] {
        return this.lignesDansLOrdreDesItems.map(l => l.superGroupe.valeur);
    }

    get formGroups(): FormGroup[] {
        return this.lignesDansLOrdreDesItems.map(l => l.superGroupe.formGroup);
    }

    get formArray(): FormArray {
        if (this.avecValeur) {
            return this.gereValeur.abstractControl as FormArray;
        }
    }

    ajouteItem(index: number, item: T) {
        const ligne = new KfVueTableLigne<T>(this, item, index);
        this.pLignes.splice(index, 0, ligne);
        if (this.avecValeur) {
            if (this.formArray) {
                this.formArray.insert(index, ligne.formGroup);
            }
        }
    }

    supprimeItem(index: number) {
        this.pLignes.splice(index, 1);
        if (this.formArray) {
            this.formArray.removeAt(index);
        }
    }

    videLignes() {
        this.pLignes = [];
        if (this.formArray) {
            while (this.formArray.controls.length > 0) {
                this.formArray.removeAt(0);
            }
        }
    }

    remplitLignes(items: T[]) {
        this.videLignes();
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            this.ajouteItem(index, item);
        }
    }

    initialise(items: T[]) {
        this.remplitLignes(items);
        if (this.trieurs) {
            this.trieurs.initialise();
        }
        if (this.pOutils) {
            this.pOutils.appliqueFiltres();
        }
    }

    get avecClic(): boolean {
        return !!this.def.quandClic;
    }

    quandClic(ligne: KfVueTableLigne<T>) {
        this.def.quandClic(ligne.item)();
    }
}
