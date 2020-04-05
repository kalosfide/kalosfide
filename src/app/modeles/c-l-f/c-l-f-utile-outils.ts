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

export class CLFUtileOutils extends DataUtileOutils {
    constructor(utile: CLFUtile) {
        super(utile);
    }

    get utile(): CLFUtile {
        return this._dataUtile as CLFUtile;
    }

    get nomOutil(): {
        client: string,
        catégorie: string,
        produit: string,
        préparation: string,
        type: string,
    } {
        return {
            client: 'client',
            produit: 'produit',
            catégorie: 'catégorie',
            préparation: 'préparation',
            type: 'type',
        };
    }

    clientDeDocsClient(): KfVueTableFiltreCherche<CLFDocs> {
        return Fabrique.vueTable.cherche<CLFDocs>(this.nomOutil.client, 'Client',
            (docsClient: CLFDocs) => docsClient.client.nom, 'Rechercher un client');
    }

    produit(): KfVueTableFiltreCherche<CLFLigne> {
        return Fabrique.vueTable.cherche<CLFLigne>(this.nomOutil.produit, 'Produit',
            (ligne: CLFLigne) => ligne.produit.nom, 'Rechercher un produit');
    }

    catégorie(): KfVueTableFiltreNombre<CLFLigne> {
        return Fabrique.vueTable.filtreNombre<CLFLigne>(this.nomOutil.catégorie, 'Catégorie',
            (ligne: CLFLigne, noCategorie: number) => ligne.produit.categorieNo === noCategorie, 'Filtrer par catégorie');
    }
    chargeCatégories(vueTable: KfVueTable<CLFLigne>, catégories: Categorie[]) {
        const outil = vueTable.outils.outil(this.nomOutil.catégorie);
        const liste: KfListeDeroulanteNombre = outil.composant as KfListeDeroulanteNombre;
        catégories.forEach((c: Categorie) => liste.créeEtAjouteOption(c.nom, c.no));
    }

    préparation(): KfVueTableFiltreTexte<CLFLigne> {
        const filtre = Fabrique.vueTable.filtreTexte<CLFLigne>(this.nomOutil.préparation,
            'Etat',
            (détail: CLFLigne, idEtat: IdEtatCLFLigne) => {
                return EtatCLFLigne.étatDeId(idEtat).vérifie(détail);
            },
            'Filtrer par préparation');
        const liste: KfListeDeroulanteTexte = filtre.liste as KfListeDeroulanteTexte;
        EtatCLFLigne.liste.forEach(e => liste.créeEtAjouteOption(e.texte, e.valeur));
        return filtre;
    }

    clientDeDoc(): KfVueTableFiltreCherche<CLFDoc> {
        return Fabrique.vueTable.cherche<CLFDoc>(this.nomOutil.client, 'Client',
            (clfDoc: CLFDoc) => clfDoc.client.nom, 'Rechercher un client');
    }

    type(): KfVueTableFiltreTexte<CLFDoc> {
        const outil = Fabrique.vueTable.filtreTexte<CLFDoc>(this.nomOutil.type, 'Type',
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
