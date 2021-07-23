import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Produit } from './produit';
import { ProduitUtile } from './produit-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsProduits } from './etat-produit';
import { Compare } from '../../commun/outils/tri';
import { TypeMesure } from '../type-mesure';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';

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
        const créeContenu = (produit: Produit) => TypeMesure.texteSeCommande(produit.typeMesure, produit.typeCommande);
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
                Compare.texte((produit: Produit) => produit.typeMesure),
                Compare.nombre((produit: Produit) => produit.prix)
            ),
            classesItem: ['prix', 'apercu'],
            nePasAfficherSi: this.utile.conditionTable.edition
        };
        return def;
    }

    prix_edite(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'prix',
            enTeteDef: { titreDef: 'Prix en €' },
            créeContenu: (produit: Produit) => produit.editeur.kfPrix,
            classesItem: ['prix', 'edite'],
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
        return def;
    }

    etat(): IKfVueTableColonneDef<Produit> {
        const créeContenu = (produit: Produit) => EtatsProduits.etat(produit.etat).texte;
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
            créeContenu: (produit: Produit) => produit.editeur.kfEtat,
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
            classesItem: ['action'],
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    supprime(quandLigneSupprimée: (produit: Produit) => void): IKfVueTableColonneDef<Produit> {
        return {
            nom: 'supprime',
            créeContenu: (produit: Produit) => {
                const bouton = this.utile.bouton.supprime(produit, quandLigneSupprimée);
                bouton.inactivité = produit.utilisé;
                return bouton;
            },
            classesItem: ['action'],
            afficherSi: this.utile.conditionTable.edition,
        };
    }


    action(quandLigneSupprimée: (produit: Produit) => void): IKfVueTableColonneDef<Produit> {
        return {
            nom: 'action',
            créeContenu: (produit: Produit) => {
                const btnGroup = new KfBBtnGroup('action');
                let bouton: KfBBtnGroupElement;
                bouton = this.utile.lien.edite(produit);
                btnGroup.ajoute(bouton);
                bouton = this.utile.bouton.supprime(produit, quandLigneSupprimée);
                bouton.inactivité = produit.utilisé;
                btnGroup.ajoute(bouton);
                return btnGroup;
            },
            classesItem: ['colonne-btn-group-2'],
            afficherSi: this.utile.conditionTable.edition,
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
            this.édite(),
            this.supprime(quandLigneSupprimée),
        ];
    }

}
