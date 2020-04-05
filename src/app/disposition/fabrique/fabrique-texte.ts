import { Produit, IAvecProduit } from 'src/app/modeles/catalogue/produit';
import { TypeMesure } from 'src/app/modeles/type-mesure';
import { TypeCommande } from 'src/app/modeles/type-commande';
import { ICoût } from 'src/app/modeles/c-l-f/cout';
import { estNombre } from 'src/app/commun/outils/est-nombre';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';

export class FabriqueTexte {

    bon(siteUid: string, siteRno: number, clientUid: string, clientRno: number, noBon: number): string {
        return siteUid + '-' + siteRno + '-' + clientUid + '-' + clientRno + '-' + noBon;
    }

    /**
     * Retourne le texte du prix, précédé de > si incomplet, suivi de €.
     * @param prix valeur du prix ou objet contenant la valeur et un champ incomplet
     */
    prix(prix: number | ICoût): string {
        let icoût: ICoût;
        if (typeof (prix) === 'number') {
            icoût = { valeur: prix, complet: true };
        } else {
            icoût = prix;
        }
        let texte: string;
        if (estNombre(icoût.valeur)) {
            texte = icoût.valeur.toLocaleString('fr-FR', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            }) + ' €';
            if (!icoût.complet) {
                texte = '> ' + texte;
            }
        } else {
            texte = '';
        }
        return texte;
    }

    typeCommande(typeCommande: string): string {
        const exemple = TypeCommande.pourExemple(typeCommande);
        return TypeCommande.pourListe(typeCommande) + (exemple ? ' (ex: ' + exemple + ')' : '');
    }

    typeMesure(typeMesure: string, ) {
        return TypeMesure.texte_au(typeMesure) + ' (ex: ' + this.prixAvecUnité(typeMesure, 12.5) + ')';
    }

    /**
     * Retourne le texte du prix, précédé de > si incomplet, suivi de € et de l'unité du type de mesure
     * @param prix valeur du prix ou objet contenant la valeur et un champ incomplet
     */
    prixAvecUnité(typeMesure: string, prix: number | ICoût): string {
        return prix <= 0 ? 'indisponible' : this.prix(prix) + ' ' + TypeMesure.texte_le(typeMesure);
    }

    prixEnToutesLettres(prix: number): string {
        return TexteOutils.en_toutes_lettres(prix, {
            unité: 'euro',
            unités: 'euros',
            séparateur: 'et',
            nbDécimales: 2,
            sous_unité: 'centime',
            sous_unités: 'centimes',
        });
    }

    private _testAvecProduit(nomFonction: string, avecProduit: IAvecProduit): Produit {
        if (!avecProduit.produit) {
            throw new Error(`${nomFonction}: le paramètre doit avoir une propriété 'produit' de type Produit`);
        }
        return avecProduit.produit as Produit;
    }
    nomCatégorie(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return produit.nomCategorie;
    }
    nomProduit(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return produit.nom;
    }
    seCommande(produit: Produit): string {
        return TypeMesure.texteSeCommande(produit.typeMesure, produit.typeCommande);
    }
    seMesure(produit: Produit): string {
        return TypeMesure.texte_au(produit.typeMesure);
    }
    avecProduit_seCommande(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.seCommande(produit);
    }

    /**
     * Retourne le texte du prix du produit suivi de € et de l'unité du type de mesure du produit
     */
    produit_prix(produit: Produit): string {
        return this.prixAvecUnité(produit.typeMesure, produit.prix);
    }
    /**
     * Retourne le texte du prix du produit suivi de € et de l'unité du type de mesure du produit
     * @param avecProduit objet ayant un champ produit
     */
    avecProduit_prix(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.produit_prix(produit);
    }
    unité(produit: Produit): string {
        return TypeMesure.unité(produit.typeMesure);
    }
    avecProduit_unité(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.unité(produit);
    }

    unités(produit: Produit, id: string): string {
        return TypeMesure.texteUnités(produit.typeMesure, id);
    }
    avecProduit_unités(avecProduit: IAvecProduit, id: string): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.unités(produit, id);
    }

    private _quantitéAvecUnité(typeMesure: string, quantité: number, idTypeCommande?: string): string {
        if (quantité === null || quantité === undefined) {
            return '';
        }
        let texte = quantité.toLocaleString('fr-FR');
        if (idTypeCommande !== TypeCommande.id.ALUnité) {
            texte += ' ' + TypeMesure.unité(typeMesure);
        }
        return texte;
    }
    texteDemande(typeMesure: string, demande: number, typeCommande?: string): string {
        return this._quantitéAvecUnité(typeMesure, demande, typeCommande);
    }
    quantitéAvecUnité(produit: Produit, quantité: number, idTypeCommande?: string): string {
        if (quantité === null || quantité === undefined) {
            return '';
        }
        let texte = quantité.toLocaleString('fr-FR');
        if (!idTypeCommande || idTypeCommande !== TypeCommande.id.ALUnité) {
            const unité = TypeMesure.unité(produit.typeMesure);
            if (unité) {
                texte += ' ' + unité;
            }
        }
        return texte;
    }

    coût(produit: Produit, quantité: number): string {
        return quantité !== undefined && quantité !== null && isNaN(quantité)
            ? this.prix(produit.prix * quantité)
            : '';
    }

}
