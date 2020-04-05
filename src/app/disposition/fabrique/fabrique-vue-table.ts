import { FabriqueClasse, Fabrique } from './fabrique';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import {
    KfTypeDEvenement, KfEvenement, KfTypeDHTMLEvents, KfStatutDEvenement
} from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { FabriqueMembre } from './fabrique-membre';
import { KfVueTableOutils } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outils';
import { KfVueTableFiltreBase } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-base';
import { KfVueTableFiltreTexte } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { KfVueTableFiltreNombre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Couleur } from './fabrique-couleurs';
import { KfVueTableOutilBtnGroupe } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil-btn-group';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { EtatTable, IEtatTableDef } from './etat-table';
import { GroupeBoutonsMessages } from './fabrique-formulaire';
import { IUrlDef } from './fabrique-url';
import { IContenuPhraseDef } from './fabrique-contenu-phrase';
import { KfVueTableCelluleEnTete } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-en-tete';
import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { IKfVueTableTrieurOptions } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-trieur';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';

export class FabriqueVueTable extends FabriqueMembre {

    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    get classeFondFiltre(): string {
        return this.fabrique.couleur.classeCouleurFond(Couleur.beige);
    }

    get classeFondFiltreInactif(): string {
        return this.fabrique.couleur.classeCouleurFond(Couleur.whitesmoke);
    }

    vueTable<T>(nom: string, vueTableDef: IKfVueTableDef<T>, classe?: string): KfVueTable<T> {
        const vueTable = new KfVueTable(nom + '_table', vueTableDef);
        vueTable.ajouteClasseDef('table-sm table-hover');
        vueTable.ajouteClasseEnTete('thead-light');
        vueTable.ajouteClasseBilan('thead-light');
        if (classe !== null) {
            if (classe === undefined) {
                classe = 'align-middle';
            }
            vueTable.colonnes.forEach(colonne => {
                colonne.ajouteClasseItem(classe);
                if (colonne.enTeteDef) {
                    colonne.ajouteClasseEntete(classe);
                }
                if (colonne.bilanDef) {
                    colonne.ajouteClasseBilan(classe);
                }
            });
        }

        if (vueTable.outils) {
            vueTable.fixeClassesFiltre(this.classeFondFiltre);
            vueTable.outils.ajouteClasseDef('border border-rounded p-1 mb-2');
            vueTable.outils.fixeClassesFiltre(this.classeFondFiltre, this.classeFondFiltreInactif);
        }

        return vueTable;
    }

    outils<T>(nom: string): KfVueTableOutils<T> {
        const outils = new KfVueTableOutils<T>();
        outils.btnToolbar.ajouteClasseDef('justify-content-between');
        return outils;
    }

    private _prépareFiltreOuCherche<T>(filtre: KfVueTableFiltreBase<T>) {
        filtre.composant.géreClasseEntree.ajouteClasseDef('input-group input-group-sm');
    }

    private _prépareFiltre<T>(filtre: KfVueTableFiltreTexte<T> | KfVueTableFiltreNombre<T>, titre: string, placeholder?: string) {
        this._prépareFiltreOuCherche<T>(filtre);
        filtre.composant.ajouteClasseDef('form-control-sm');
        const fauxBouton = this.fabrique.bouton.bouton({
            nom: '',
            contenu: { nomIcone: this.fabrique.icone.nomIcone.filtre }
        });
        fauxBouton.inactivité = true;
        filtre.liste.composantAvant = fauxBouton;
        if (placeholder) {
            const option0 = filtre.liste.créeOption0();
            option0.contenuPhrase.fixeTexte(placeholder);
            filtre.liste.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                (évènement: KfEvenement) => {
                    console.log(filtre.liste.valeur);
                    const estSur0 = filtre.liste.valeur === undefined;
                    if (estSur0) {
                        option0.contenuPhrase.fixeTexte(placeholder);
                        option0.supprimeClasseDef('font-italic');
                    } else {
                        option0.contenuPhrase.fixeTexte('Annuler le filtre');
                        option0.ajouteClasseDef('font-italic font-weight-bold');
                    }

                });
        }
        return filtre;
    }

    cherche<T>(nom: string, titre: string, texte: (t: T) => string, placeholder?: string): KfVueTableFiltreCherche<T> {
        const filtre = new KfVueTableFiltreCherche<T>(nom, texte);
        this._prépareFiltreOuCherche<T>(filtre);
        const fauxBouton = this.fabrique.bouton.bouton({
            nom: '',
            contenu: { nomIcone: this.fabrique.icone.nomIcone.cherche }
        });
        fauxBouton.inactivité = true;
        filtre.texte.composantAvant = fauxBouton;
        filtre.texte.créeBoutonEfface();
        filtre.texte.placeholder = placeholder;
        return filtre;
    }

    filtreTexte<T>(nom: string, titre: string, valide: (t: T, valeur: string) => boolean, placeholder?: string): KfVueTableFiltreTexte<T> {
        const filtre = new KfVueTableFiltreTexte<T>(nom, valide);
        this._prépareFiltre(filtre, titre, placeholder);
        return filtre;
    }

    filtreNombre<T>(nom: string, titre: string, valide: (t: T, valeur: number) => boolean, placeholder?: string)
        : KfVueTableFiltreNombre<T> {
        const filtre = new KfVueTableFiltreNombre<T>(nom, valide);
        this._prépareFiltre(filtre, titre, placeholder);
        return filtre;
    }

    outilAjoute<T>(lien: KfLien, aide?: KfBouton): KfVueTableOutilBtnGroupe<T> {
        const outilAjoute = new KfVueTableOutilBtnGroupe<T>('ajout', lien);
        if (aide) {
            outilAjoute.bbtnGroup.ajoute(aide);
        }
        outilAjoute.bbtnGroup.taille('sm');
        outilAjoute.bbtnGroup.ajouteClasseDef('ml-4');
        return outilAjoute;
    }

    etatTable(def: IEtatTableDef): EtatTable {
        const etiquettes = [];
        for (let i = 0; i < def.nbMessages; i++) {
            this.fabrique.ajouteEtiquetteP(etiquettes);
        }
        const groupe = new GroupeBoutonsMessages('etat', etiquettes);
        if (def.avecSolution) {
            const bouton = this.fabrique.lien.petitBouton('solution');
            groupe.créeBoutons([bouton]);
        }
        const etatTable = new EtatTable(groupe, def);
        return etatTable;
    }

    private créeDéclencheTri<T>(enTête: KfVueTableCelluleEnTete<T>): KfGéreCss {
        const i = new KfIcone('i' + (enTête.colonne.index + 1));
        i.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        enTête.composant.contenuPhrase.ajoute(i);
        return i;
    }

    private rafraichitDéclencheTri(déclencheur: any, desc: boolean, estDernierTri: boolean) {
        const icone = déclencheur as KfIcone;
        if (desc !== true) {
            icone.nomIcone = 'sort-asc';
        } else {
            icone.nomIcone = 'sort-desc';
        }
    }

    optionsDeTrieur<T>(inits?: { nomTri: string, desc?: boolean }[]): IKfVueTableTrieurOptions<T> {
        return {
            inits,
            créeDéclencheur: (this.créeDéclencheTri).bind(this),
            rafraichitDéclencheur: (this.rafraichitDéclencheTri).bind(this)
        };
    }

}
