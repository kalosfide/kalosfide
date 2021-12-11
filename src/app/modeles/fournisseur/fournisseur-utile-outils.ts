import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfVueTableFiltreTexte } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { EtatsRole, IdEtatRole } from '../role/etat-role';
import { KfListeDeroulanteTexte } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { FournisseurUtile } from './fournisseur-utile';
import { FournisseurUtileUrl } from './fournisseur-utile-url';
import { FournisseurUtileLien } from './fournisseur-utile-lien';
import { Fournisseur } from './fournisseur';

export class FournisseurUtileOutils extends DataUtileOutils {
    constructor(utile: FournisseurUtile) {
        super(utile);
    }

    get utile(): FournisseurUtile {
        return this._dataUtile as FournisseurUtile;
    }

    get url(): FournisseurUtileUrl {
        return this.utile.url;
    }

    get lien(): FournisseurUtileLien {
        return this.utile.lien;
    }

    get nomOutil(): {
        site: string,
    } {
        return {
            site: 'site',
        };
    }

    chercheFournisseur(): KfVueTableFiltreCherche<Fournisseur> {
        return Fabrique.vueTable.cherche<Fournisseur>('fournisseur', 'fournisseur', 'Rechercher un site');
    }

    état(): KfVueTableFiltreTexte<Fournisseur> {
        const filtre = Fabrique.vueTable.filtreTexte('etat', (fournisseur: Fournisseur, état: IdEtatRole) => fournisseur.etat === état, 'Filtrer par état')
        EtatsRole.états.forEach(état => (filtre.composant as KfListeDeroulanteTexte).créeEtAjouteOption(état.texte, état.valeur));
        return filtre;
    }

}
