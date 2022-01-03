import { CLFUtile } from './c-l-f-utile';
import { KfVueTableFiltreNombre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { KfVueTableFiltreTexte } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import {
    KfListeDeroulanteTexte,
    KfListeDeroulanteNombre
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { Categorie } from '../catalogue/categorie';
import { CLFLigne } from './c-l-f-ligne';
import { CLFDoc } from './c-l-f-doc';
import { TypesCLF } from './c-l-f-type';
import { IdEtatCLFLigne, EtatCLFLigne } from './c-l-f-etat';
import { CLFDocs } from './c-l-f-docs';
import { CLFClientBilanDocs } from './c-l-f-bilan-docs';

export class CLFUtileOutils extends DataUtileOutils {
    constructor(utile: CLFUtile) {
        super(utile);
    }

    get utile(): CLFUtile {
        return this._dataUtile as CLFUtile;
    }

    clientDeDocsClient(): KfVueTableFiltreCherche<CLFDocs> {
        return Fabrique.vueTable.cherche<CLFDocs>(this.utile.nom.client, this.utile.nom.client, 'Rechercher un client');
    }

    produit(): KfVueTableFiltreCherche<CLFLigne> {
        return Fabrique.vueTable.cherche<CLFLigne>(this.utile.nom.produit, this.utile.nom.produit, 'Rechercher un produit');
    }

    catégorie(): KfVueTableFiltreNombre<CLFLigne> {
        return Fabrique.vueTable.filtreNombre<CLFLigne>(this.utile.nom.catégorie,
            (ligne: CLFLigne, noCategorie: number) => ligne.produit.categorieId === noCategorie, 'Filtrer par catégorie');
    }
    chargeCatégories(vueTable: KfVueTable<CLFLigne>, catégories: Categorie[]) {
        const outil = vueTable.outils.outil(this.utile.nom.catégorie);
        const liste: KfListeDeroulanteNombre = outil.composant as KfListeDeroulanteNombre;
        catégories.forEach((c: Categorie) => liste.créeEtAjouteOption(c.nom, c.no));
    }

    préparation(): KfVueTableFiltreTexte<CLFLigne> {
        const filtre = Fabrique.vueTable.filtreTexte<CLFLigne>(this.utile.nom.préparation,
            (détail: CLFLigne, idEtat: IdEtatCLFLigne) => {
                return EtatCLFLigne.étatDeId(idEtat).vérifie(détail);
            },
            'Filtrer par préparation');
        const liste: KfListeDeroulanteTexte = filtre.liste as KfListeDeroulanteTexte;
        EtatCLFLigne.liste.forEach(e => liste.créeEtAjouteOption(e.texte, e.valeur));
        return filtre;
    }

    clientDeDoc(): KfVueTableFiltreCherche<CLFDoc> {
        return Fabrique.vueTable.cherche<CLFDoc>(this.utile.nom.client, this.utile.nom.client, 'Rechercher un client');
    }

    clientDeClientBilanDocs(): KfVueTableFiltreCherche<CLFClientBilanDocs> {
        return Fabrique.vueTable.cherche<CLFClientBilanDocs>(this.utile.nom.client, this.utile.nom.client, 'Rechercher un client');
    }

    type(): KfVueTableFiltreTexte<CLFDoc> {
        const outil = Fabrique.vueTable.filtreTexte<CLFDoc>(this.utile.nom.type,
            (clfDoc: CLFDoc, type: string) => {
                return clfDoc.type === type;
            }, 'Filtrer par type');
        const liste = outil.composant as KfListeDeroulanteTexte;
        TypesCLF.forEach(t => {
            const texte = this.utile.texte.textes(t);
            liste.créeEtAjouteOption(texte.def.doc, t);
        });
        return outil;
    }

}
