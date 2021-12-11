import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { ProduitUtile } from './produit-utile';
import { ProduitUtileUrl } from './produit-utile-url';
import { ProduitUtileLien } from './produit-utile-lien';
import { Produit } from './produit';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { Catalogue } from './catalogue';

export class ProduitUtileBouton extends DataUtileBouton {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this.dataUtile as ProduitUtile;
    }

    get url(): ProduitUtileUrl {
        return this.utile.url;
    }

    get lien(): ProduitUtileLien {
        return this.utile.lien;
    }

    supprime(produit: Produit, quandSupprimé: (index: number, aprésSuppression: Catalogue) => void): KfBouton {
        const titre = `Suppression d'un produit`;
        const description = new KfEtiquette('');
        description.baliseHtml = KfTypeDeBaliseHTML.p;
        description.ajouteTextes(
            `Le produit `,
            {
                texte: produit.nom,
                balise: KfTypeDeBaliseHTML.b
            },
            ' de la catégorie ',
            {
                texte: `${produit.nomCategorie}`,
                balise: KfTypeDeBaliseHTML.b
            },
            ' au prix de ',
            {
                texte: Fabrique.texte.eurosAvecTypeMesure(produit.typeMesure, produit.prix),
                balise: KfTypeDeBaliseHTML.b
            },
            ' va être supprimé.'
        );
        const apiRequêteAction: ApiRequêteAction = this.utile.service.apiRequêteSupprime(produit, quandSupprimé);
        const bouton = Fabrique.bouton.attenteDeColonne('supprime' + produit.no,
            Fabrique.contenu.supprime(), apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, 'danger', [description])
        );
        return bouton;
    }

}
