import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Produit } from './produit';
import { ProduitUtile } from './produit-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsProduits } from './etat-produit';
import { Compare } from '../../commun/outils/tri';
import { TypeMesureFabrique } from '../type-mesure';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';
import { Catalogue } from './catalogue';

export class ProduitUtileColonne extends DataUtileColonne {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._parent as ProduitUtile;
    }


    catégorie(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: this.utile.nom.catégorie,
            enTeteDef: { titreDef: 'Catégorie' },
            créeContenu: (produit: Produit) => produit.nomCategorie,
            compare: Compare.enchaine(
                Compare.texte((produit: Produit) => produit.nomCategorie),
                Compare.texte((produit: Produit) => produit.nom),
                ),
        };
        return def;
    }

    produit(): IKfVueTableColonneDef<Produit> {
        const créeContenu = (produit: Produit) => produit.nom;
        const def: IKfVueTableColonneDef<Produit> = {
            nom: this.utile.nom.produit,
            enTeteDef: { titreDef: 'Nom' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
        return def;
    }

    typeCommande(): IKfVueTableColonneDef<Produit> {
        const créeContenu = (produit: Produit) => TypeMesureFabrique.texteSeCommande(produit.typeMesure, produit.typeCommande);
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'typeCommande',
            enTeteDef: { titreDef: 'Se commande' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
        return def;
    }

    typeMesure(): IKfVueTableColonneDef<Produit> {
        const créeContenu = (produit: Produit) => Fabrique.texte.seMesure(produit);
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'typeMesure',
            enTeteDef: { titreDef: 'Se facture' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
        return def;
    }

    prix(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'prix',
            enTeteDef: { titreDef: 'Prix' },
            créeContenu: (produit: Produit) => Fabrique.texte.euros(produit.prix),
            compare: Compare.enchaine(
                Compare.nombre((produit: Produit) => produit.typeMesure),
                Compare.nombre((produit: Produit) => produit.prix)
            ),
            classesTd: ['prix', 'apercu'],
            nePasAfficherSi: this.utile.conditionTable.edition
        };
        return def;
    }

    prix_edite(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'prix',
            enTeteDef: { titreDef: 'Prix en €' },
            créeContenu: (produit: Produit) => produit.editeur.kfPrix,
            classesTd: ['prix', 'edite'],
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
        return def;
    }

    etat(): IKfVueTableColonneDef<Produit> {
        const créeContenu = (produit: Produit) => EtatsProduits.état(produit.disponible).texte;
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu,
            compare: Compare.texte(créeContenu),
            nePasAfficherSi: this.utile.conditionTable.edition
        };
        return def;
    }

    etat_edite(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (produit: Produit) => produit.editeur.kfDisponible,
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
        return def;
    }

    édite(): IKfVueTableColonneDef<Produit> {
        return {
            nom: 'edite',
            créeContenu: (produit: Produit) => {
                const bouton = this.utile.lien.edite(produit);
                return bouton;
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
    }

    supprime(quandSupprimé: (index: number, aprésSuppression: Catalogue) => void): IKfVueTableColonneDef<Produit> {
        return {
            nom: 'supprime',
            créeContenu: (produit: Produit) => {
                const bouton = this.utile.bouton.supprime(produit, quandSupprimé);
                bouton.inactivité = produit.utilisé;
                return bouton;
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
    }

    colonnes(): IKfVueTableColonneDef<Produit>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.typeCommande(),
            this.typeMesure(),
            this.prix(),
        ];
    }

    colonnesFournisseur(quandSupprimé: (index: number, aprésSuppression: Catalogue) => void): IKfVueTableColonneDef<Produit>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.typeCommande(),
            this.typeMesure(),
            this.prix(),
            this.prix_edite(),
            this.etat(),
            this.etat_edite(),
            this.édite(),
            this.supprime(quandSupprimé),
        ];
    }

}
