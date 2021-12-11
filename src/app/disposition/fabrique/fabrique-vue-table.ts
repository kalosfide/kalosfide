import { FabriqueClasse } from './fabrique';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { FabriqueMembre } from './fabrique-membre';
import { KfVueTableOutils } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outils';
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
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

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

    vueTable<T>(nom: string, vueTableDef: IKfVueTableDef<T>): KfVueTable<T> {
        const vueTable = new KfVueTable<T>(nom + '_table', vueTableDef);
        vueTable.ajouteClasse('table-sm table-hover table-borderless');
        if (vueTable.enTete) {
            vueTable.enTete.gereCss.ajouteClasse('table-light');
        }
        if (vueTable.bilan) {
            vueTable.bilan.gereCss.ajouteClasse('table-light');
        }
        vueTable.colonnes.forEach(colonne => {
            colonne.ajouteClasseItem('align-middle');
            if (colonne.enTeteDef) {
                colonne.ajouteClasseEnteteTh('align-middle');
            }
            if (colonne.bilanDef) {
                colonne.ajouteClasseBilan('align-middle');
            }
        });

        if (vueTable.outils) {
            vueTable.fixeClassesFiltre(this.classeFondFiltre);
            vueTable.outils.ajouteClasse('border border-rounded p-1 mb-2');
            vueTable.outils.fixeClassesFiltre(this.classeFondFiltre);
        }

        vueTable.créeDiv();
        vueTable.géreCssDiv.ajouteClasse('table-responsive');

        return vueTable;
    }

    outils<T>(): KfVueTableOutils<T> {
        const outils = new KfVueTableOutils<T>();
        KfBootstrap.prépareToolbar(outils.groupe, 'outils');
        outils.groupe.ajouteClasse('justify-content-between');
        return outils;
    }

    private iconeAvant(iconeDef: IKfIconeDef, inactif: () => boolean): KfEtiquette {
        const icone = this.fabrique.icone.icone(iconeDef);
        icone.ajouteClasse(
            {
                nom: KfBootstrap.classeTexte({ color: 'muted' }),
                active: inactif
            }
        )
        const étiquette = new KfEtiquette('');
        étiquette.contenuPhrase.ajouteContenus(icone);
        return étiquette;
    }

    private _prépareFiltre<T>(filtre: KfVueTableFiltreTexte<T> | KfVueTableFiltreNombre<T>, placeholder?: string) {
        const inactif: () => boolean = () => filtre.liste.valeur === undefined;
        const fauxBouton = this.iconeAvant(this.fabrique.icone.def.filtre, inactif);
        filtre.liste.fixeComposantAvant(fauxBouton);
        if (placeholder) {
            const option0 = filtre.liste.créeOption0();
            option0.contenuPhrase.fixeTexte(placeholder);
            filtre.liste.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                () => {
                    console.log(filtre.liste.valeur);
                    if (inactif()) {
                        option0.contenuPhrase.fixeTexte(placeholder);
                        option0.supprimeClasse('font-italic');
                    } else {
                        option0.contenuPhrase.fixeTexte('Annuler le filtre');
                        option0.ajouteClasse('font-italic font-weight-bold');
                    }

                });
        }
        KfBootstrap.prépare(filtre.composant, {
            taille: 'sm',
            dansInputGroup: true
        });
        return filtre;
    }

    cherche<T>(nom: string, colonne: string, placeholder?: string): KfVueTableFiltreCherche<T> {
        const filtre = new KfVueTableFiltreCherche<T>(nom, colonne, KfBootstrap.classeFond('warning'));
        filtre.composant.ajouteClasse('form-control');
        const inactif: () => boolean = () => !filtre.texte.valeur || filtre.texte.valeur === ''
        const fauxBouton = this.iconeAvant(this.fabrique.icone.def.cherche, inactif);
        filtre.texte.fixeComposantAvant(fauxBouton);
        filtre.texte.ajouteEffaceur(this.fabrique.icone.def.croix);
        filtre.texte.placeholder = placeholder;
        KfBootstrap.prépare(filtre.composant, {
            taille: 'sm',
            dansInputGroup: true
        });
        return filtre;
    }

    filtreTexte<T>(nom: string, valide: (t: T, valeur: string) => boolean, placeholder?: string): KfVueTableFiltreTexte<T> {
        const filtre = new KfVueTableFiltreTexte<T>(nom, valide);
        this._prépareFiltre(filtre, placeholder);
        return filtre;
    }

    filtreNombre<T>(nom: string, valide: (t: T, valeur: number) => boolean, placeholder?: string)
        : KfVueTableFiltreNombre<T> {
        const filtre = new KfVueTableFiltreNombre<T>(nom, valide);
        this._prépareFiltre(filtre, placeholder);
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
            const bouton = this.fabrique.lien.bouton('solution');
            boutons = [bouton];
        }
        const groupe = new GroupeBoutonsMessages('etat', { messages, boutons });
        const etatTable = new EtatTable(groupe, def);
        return etatTable;
    }

    pagination<T>(nomLigne?: string, nomLignes?: string): KfVueTablePagination<T> {
        const def: IKfVueTablePaginationDef = {
            icone: this.fabrique.icone.iconesPagination(),
            nbBoutons: 5,
            choixNbParPage: [5, 10, 15],
            nbParPage: 10,
            avecEtat: {
                nomLigne,
                nomLignes
            },
            optionToutesLesLignes: true,
            nePasAfficherSiUneSeulePage: true,
        };
        const pagination = new KfVueTablePagination<T>(def);
        KfBootstrap.prépareToolbar(pagination.groupe, 'pagination')
        pagination.groupe.ajouteClasse('justify-content-between pt-1');
        pagination.etat.bbtnGroup.taille('sm');
        pagination.etat.etiquette.ajouteClasse('form-control-sm');
        pagination.boutons.bbtnGroup.taille('sm');
        pagination.boutons.bbtnGroup.ajouteClasse('pagination');
        pagination.boutons.boutons.forEach(b => {
            b.ajouteClasse('btn', KfBootstrap.classe('btn', 'secondary', 'outline'));
        });
        pagination.choixNbParPage.liste.géreClasseEntree.ajouteClasse('input-group input-group-sm');
        pagination.choixNbParPage.liste.ajouteClasse('form-select form-select-sm');
        return pagination;
    }
}
