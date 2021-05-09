import { FabriqueClasse, Fabrique } from './fabrique';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
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
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { IKfVueTablePaginationDef, KfVueTablePagination } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-pagination';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';

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

    private get classeOutilActif(): string {
        return this.fabrique.couleur.classeCouleurFond(Couleur.orange);
    }

    vueTable<T>(nom: string, vueTableDef: IKfVueTableDef<T>): KfVueTable<T> {
        vueTableDef.nePasMontrerIconeDeTriSiPasTrié = true;
        vueTableDef.colonneNoLigneDef = {
            classeDefs: ['no-ligne'],
        };
        const vueTable = new KfVueTable<T>(nom + '_table', vueTableDef);
        vueTable.ajouteClasse('table-sm table-hover');
        if (vueTable.enTete) {
            vueTable.enTete.gereCss.ajouteClasse('thead-light');
        }
        if (vueTable.bilan) {
            vueTable.bilan.gereCss.ajouteClasse('thead-light');
        }
        vueTable.colonnes.forEach(colonne => {
            colonne.ajouteClasseItem('align-middle');
            if (colonne.enTeteDef) {
                colonne.ajouteClasseEntete('align-middle');
            }
            if (colonne.bilanDef) {
                colonne.ajouteClasseBilan('align-middle');
            }
        });

        if (vueTable.outils) {
            vueTable.fixeClassesFiltre(this.classeFondFiltre);
            vueTable.outils.ajouteClasse('border border-rounded p-1 mb-2');
            vueTable.outils.fixeClassesFiltre(this.classeFondFiltre, this.classeFondFiltreInactif);
        }

        return vueTable;
    }

    outils<T>(): KfVueTableOutils<T> {
        const outils = new KfVueTableOutils<T>();
        outils.btnToolbar.ajouteClasse('justify-content-between');
        return outils;
    }

    private _prépareFiltreOuCherche<T>(filtre: KfVueTableFiltreBase<T>) {
        filtre.composant.géreClasseEntree.ajouteClasse('input-group input-group-sm');
    }

    private _prépareFiltre<T>(filtre: KfVueTableFiltreTexte<T> | KfVueTableFiltreNombre<T>, titre: string, placeholder?: string) {
        this._prépareFiltreOuCherche<T>(filtre);
        filtre.composant.ajouteClasse('form-control-sm');
        const fauxBouton = this.fabrique.bouton.bouton({
            nom: '',
            contenu: { nomIcone: this.fabrique.icone.nomIcone.filtre }
        });
        fauxBouton.inactivité = true;
        filtre.liste.fixeComposantAvant(fauxBouton, 'input-group-prepend');
        if (placeholder) {
            const option0 = filtre.liste.créeOption0();
            option0.contenuPhrase.fixeTexte(placeholder);
            filtre.liste.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                () => {
                    console.log(filtre.liste.valeur);
                    const estSur0 = filtre.liste.valeur === undefined;
                    if (estSur0) {
                        option0.contenuPhrase.fixeTexte(placeholder);
                        option0.supprimeClasse('font-italic');
                        fauxBouton.supprimeClasse(this.classeOutilActif);
                    } else {
                        option0.contenuPhrase.fixeTexte('Annuler le filtre');
                        option0.ajouteClasse('font-italic font-weight-bold');
                        fauxBouton.ajouteClasse(this.classeOutilActif);
                    }

                });
        }
        return filtre;
    }

    cherche<T>(nom: string, titre: string, colonne: string, placeholder?: string): KfVueTableFiltreCherche<T> {
        const filtre = new KfVueTableFiltreCherche<T>(nom, colonne);
        this._prépareFiltreOuCherche<T>(filtre);
        const fauxBouton = this.fabrique.bouton.bouton({
            nom: '',
            contenu: { nomIcone: this.fabrique.icone.nomIcone.cherche }
        });
        fauxBouton.inactivité = true;
        fauxBouton.ajouteClasse({ nom: this.classeOutilActif, active: () => filtre.texte.valeur && filtre.texte.valeur !== '' });
        filtre.texte.fixeComposantAvant(fauxBouton, 'input-group-prepend');
        filtre.texte.ajouteEffaceur(this.fabrique.icone.nomIcone.croix);
        filtre.texte.ajouteCssDivBouton('input-group-sm');
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
        outilAjoute.bbtnGroup.ajouteClasse('ml-4');
        return outilAjoute;
    }

    etatTable(def: IEtatTableDef): EtatTable {
        const messages = [];
        for (let i = 0; i < def.nbMessages; i++) {
            this.fabrique.ajouteEtiquetteP(messages);
        }
        let boutons: (KfBouton | KfLien)[];
        if (def.avecSolution) {
            const bouton = this.fabrique.lien.lien('solution');
            boutons = [bouton];
        }
        const groupe = new GroupeBoutonsMessages('etat', { messages, boutons });
        const etatTable = new EtatTable(groupe, def);
        return etatTable;
    }

    pagination<T>(): KfVueTablePagination<T> {
        const def: IKfVueTablePaginationDef = {
            icone: this.fabrique.icone.iconesPagination(),
            nbBoutons: 5,
            choixNbParPage: [4, 8, 12],
            nbParPage: 8,
            avecEtat: true,
            optionToutesLesLignes: true,
            nePasAfficherSiUneSeulePage: true,
        };
        const pagination = new KfVueTablePagination<T>(def);
        pagination.btnToolbar.ajouteClasse('justify-content-between pt-1');
        pagination.etat.bbtnGroup.taille('sm');
        pagination.etat.etiquette.ajouteClasse('form-control-sm');
        pagination.boutons.bbtnGroup.taille('sm');
        pagination.boutons.bbtnGroup.ajouteClasse('pagination');
        pagination.boutons.boutons.forEach(b => {
            b.ajouteClasse('btn btn-light btn-sm');
            });
        pagination.choixNbParPage.liste.géreClasseEntree.ajouteClasse('input-group input-group-sm');
        pagination.choixNbParPage.liste.ajouteClasse('form-control-sm');
        return pagination;
    }
}
