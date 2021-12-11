import { FournisseurUtile } from './fournisseur-utile';
import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { TexteEtatRole, IdEtatRole } from '../role/etat-role';
import { Compare } from '../../commun/outils/tri';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { Fournisseur } from './fournisseur';
import { KfVueTableCellule } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-cellule';

export class FournisseurUtileColonne extends DataUtileColonne {
    constructor(utile: FournisseurUtile) {
        super(utile);
    }

    get utile(): FournisseurUtile {
        return this._parent as FournisseurUtile;
    }

    titre(): IKfVueTableColonneDef<Fournisseur> {
        const créeContenu = (fournisseur: Fournisseur) => fournisseur.titre;
        return {
            nom: 'titre',
            enTeteDef: { titreDef: 'Titre' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
    }

    url(): IKfVueTableColonneDef<Fournisseur> {
        const créeContenu = (fournisseur: Fournisseur) => fournisseur.url;
        return {
            nom: 'url',
            enTeteDef: { titreDef: 'Url' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
    }

    créé(): IKfVueTableColonneDef<Fournisseur> {
        return {
            nom: 'cree',
            enTeteDef: { titreDef: 'Créé' },
            créeContenu: (fournisseur: Fournisseur) => () => TexteOutils.date.en_chiffres(fournisseur.date0),
            largeur: LargeurColonne.date,
            compare: Compare.date((fournisseur: Fournisseur) => fournisseur.date0)
        };
    }

    état(): IKfVueTableColonneDef<Fournisseur> {
        return {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (fournisseur: Fournisseur) => () => TexteEtatRole(fournisseur.etat),
            compare: Compare.enchaine(
                Compare.texte((fournisseur: Fournisseur) => TexteEtatRole(fournisseur.etat)),
                Compare.date((fournisseur: Fournisseur) => fournisseur.dateEtat)
            ),
            largeur: LargeurColonne.role_état,
            quandItemModifié: 'rafraichit'
        };
    }

    date(): IKfVueTableColonneDef<Fournisseur> {
        return {
            nom: 'date',
            enTeteDef: { titreDef: 'Depuis' },
            créeContenu: (fournisseur: Fournisseur) => () => TexteOutils.date.en_chiffres(fournisseur.dateEtat),
            largeur: LargeurColonne.date,
            compare: Compare.date((fournisseur: Fournisseur) => fournisseur.dateEtat),
            quandItemModifié: 'rafraichit'
        };
    }

    fournisseur(): IKfVueTableColonneDef<Fournisseur> {
        const créeContenu = (fournisseur: Fournisseur) => fournisseur.nom;
        return {
            nom: 'fournisseur',
            enTeteDef: { titreDef: 'Fournisseur' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
    }

    email(): IKfVueTableColonneDef<Fournisseur> {
        const créeContenu = (fournisseur: Fournisseur) => fournisseur.email;
        return {
            nom: 'email',
            enTeteDef: { titreDef: 'Email' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
    }

    active(rafraichitComponent: () => void): IKfVueTableColonneDef<Fournisseur> {
        return {
            nom: 'active',
            créeContenu: (fournisseur: Fournisseur) => this.utile.bouton.active(fournisseur, rafraichitComponent),
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            quandItemModifié: 'rafraichit',
        };
    }

    colonnes(rafraichitComponent?: () => void): IKfVueTableColonneDef<Fournisseur>[] {
        return [
            this.titre(),
            this.url(),
            this.créé(),
            this.état(),
            this.date(),
            this.fournisseur(),
            this.email(),
            this.active(rafraichitComponent),
        ];
    }
}
