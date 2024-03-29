import { Produit, IAvecProduit } from 'src/app/modeles/catalogue/produit';
import { TypeMesure, TypeMesureFabrique } from 'src/app/modeles/type-mesure';
import { TypeCommande, TypeCommandeFabrique } from 'src/app/modeles/type-commande';
import { ICoût } from 'src/app/modeles/c-l-f/cout';
import { estNombre } from 'src/app/commun/outils/est-nombre';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

export interface IKfstringDef {
    nom?: string;
    texte: string;
    balise?: KfTypeDeBaliseHTML;
    suiviDeSaut?: boolean;
    classe?: string;
}

export class FabriqueTexte {

    bon(siteUid: string, siteRno: number, clientUid: string, clientRno: number, noBon: number): string {
        return siteUid + '-' + siteRno + '-' + clientUid + '-' + clientRno + '-' + noBon;
    }

    /**
     * Retourne le texte du prix, précédé de > si incomplet, suivi de €.
     * @param valeur valeur du prix ou objet contenant la valeur et un champ incomplet
     */
    euros(valeur: number | ICoût): string {
        let icoût: ICoût;
        if (typeof (valeur) === 'number') {
            icoût = { valeur, complet: true };
        } else {
            icoût = valeur;
        }
        let texte: string;
        if (estNombre(icoût.valeur) && icoût.valeur > 0) {
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

    /**
     * Texte de l'option de la liste déroulante de choix du type de commande d'un produit
     */
    typeCommande(typeCommande: TypeCommande): string {
        const exemple = TypeCommandeFabrique.pourExemple(typeCommande);
        return TypeCommandeFabrique.pourListe(typeCommande) + (exemple ? ' (ex: ' + exemple + ')' : '');
    }

    /**
     * Texte de l'option de la liste déroulante de choix du type de commande d'un produit
     */
    typeMesure(typeMesure: TypeMesure): string {
        return TypeMesureFabrique.texte_au(typeMesure) + ' (ex: ' + this.eurosAvecTypeMesure(typeMesure, 12.5) + ')';
    }

    /**
     * Retourne le texte du prix, précédé de > si incomplet, suivi de € et de l'unité du type de mesure
     * @param valeur valeur du prix ou objet contenant la valeur et un champ incomplet
     */
    eurosAvecTypeMesure(typeMesure: TypeMesure, valeur: number | ICoût): string {
        return valeur <= 0 ? 'indisponible' : this.euros(valeur) + ' ' + TypeMesureFabrique.texte_le(typeMesure);
    }

    eurosEnToutesLettres(valeur: number): string {
        return TexteOutils.en_toutes_lettres(valeur, {
            unité: 'euro',
            unités: 'euros',
            séparateur: 'et',
            nbDécimales: 2,
            sous_unité: 'centime',
            sous_unités: 'centimes',
        });
    }

    seMesure(produit: Produit): string {
        return TypeMesureFabrique.texte_au(produit.typeMesure);
    }

    /**
     * Retourne le texte du prix du produit suivi de € et de l'unité du type de mesure du produit
     */
    produit_prix(produit: Produit): string {
        return this.eurosAvecTypeMesure(produit.typeMesure, produit.prix);
    }

    quantitéAvecUnité(produit: Produit, quantité: number, typeCommande?: TypeCommande): string {
        if (quantité === null || quantité === undefined) {
            return '';
        }
        let texte = quantité.toLocaleString('fr-FR');
        const typeMesure: TypeMesure = typeCommande === TypeCommande.ALUnité && produit.typeCommande === TypeCommande.ALUnitéOuEnVrac
            ? TypeMesure.Aucune : produit.typeMesure;
        texte += ' ' + (quantité <= 1 ?  TypeMesureFabrique.unité(typeMesure) : TypeMesureFabrique.unités(typeMesure));
        return texte;
    }

    coût(produit: Produit, quantité: number): string {
        return quantité !== undefined && quantité !== null && isNaN(quantité)
            ? this.euros(produit.prix * quantité)
            : '';
    }

}
