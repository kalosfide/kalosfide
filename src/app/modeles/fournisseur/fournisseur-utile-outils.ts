import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsRole, EtatRole } from '../role/etat-role';
import { KfListeDeroulanteNombre } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { FournisseurUtile } from './fournisseur-utile';
import { FournisseurUtileUrl } from './fournisseur-utile-url';
import { FournisseurUtileLien } from './fournisseur-utile-lien';
import { Fournisseur } from './fournisseur';
import { KfVueTableFiltreNombre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';

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

    état(): KfVueTableFiltreNombre<Fournisseur> {
        const filtre = Fabrique.vueTable.filtreNombre('etat', (fournisseur: Fournisseur, état: EtatRole) => fournisseur.etat === état, 'Filtrer par état')
        EtatsRole.états.forEach(état => (filtre.composant as KfListeDeroulanteNombre).créeEtAjouteOption(EtatsRole.texte(état), état));
        return filtre;
    }

}
