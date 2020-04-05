import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from 'src/app/commun/outils/tri';
import { Produit } from './produit';
import { ProduitUtile } from './produit-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsProduits } from './etat-produit';
import { Compare } from '../compare';

export class ProduitUtileColonne extends DataUtileColonne {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._parent as ProduitUtile;
    }


    catégorie(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'catégorie',
            enTeteDef: { titreDef: 'Catégorie' },
            tri: new Tri('catégorie', (p1: Produit, p2: Produit) => Compare.nomCatégorie(p1, p2)),
            créeContenu: (produit: Produit) => produit.nomCategorie
        };
        return def;
    }

    produit(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'produit',
            enTeteDef: { titreDef: 'Nom' },
            tri: new Tri('produit', (p1: Produit, p2: Produit) => Compare.nomProduit(p1, p2)),
            créeContenu: (produit: Produit) => produit.nom
        };
        return def;
    }

    typeCommande(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'typeCommande',
            enTeteDef: { titreDef: 'Se commande' },
            créeContenu: (produit: Produit) => Fabrique.texte.seCommande(produit)
        };
        return def;
    }

    typeMesure(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'typeMesure',
            enTeteDef: { titreDef: 'Se facture' },
            créeContenu: (produit: Produit) => Fabrique.texte.seMesure(produit)
        };
        return def;
    }

    prix(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'prix',
            enTeteDef: { titreDef: 'Prix' },
            créeContenu: (produit: Produit) => Fabrique.texte.prix(produit.prix),
            nePasAfficherSi: this.utile.conditionTable.edition
        };
        return def;
    }

    prix_edite(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'prix',
            enTeteDef: { titreDef: 'Prix en €' },
            créeContenu: (produit: Produit) => ({ composant: produit.editeur.kfPrix }),
            nePasAfficherSi: this.utile.conditionSite.pas_catalogue
        };
        return def;
    }

    etat(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (produit: Produit) => EtatsProduits.etat(produit.etat).texte,
            nePasAfficherSi: this.utile.conditionTable.edition
        };
        return def;
    }

    etat_edite(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (produit: Produit) => ({ composant: produit.editeur.kfEtat }),
            nePasAfficherSi: this.utile.conditionSite.pas_catalogue
        };
        return def;
    }

    supprime(quandLigneSupprimée: (produit: Produit) => void): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'supprime',
            créeContenu: (produit: Produit) => {
                const bouton = this.utile.bouton.supprime(produit, quandLigneSupprimée);
                bouton.inactivité = produit.utilisé;
                return { composant: bouton };
            },
            nePasAfficherSi: this.utile.conditionSite.pas_catalogue
        };
        return def;
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

    colonnesFournisseur(quandLigneSupprimée: (produit: Produit) => void): IKfVueTableColonneDef<Produit>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.typeCommande(),
            this.typeMesure(),
            this.prix(),
            this.prix_edite(),
            this.etat(),
            this.etat_edite(),
            this.supprime(quandLigneSupprimée),
        ];
    }

}
