import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { CategorieUtile } from './categorie-utile';
import { CategorieUtileUrl } from './categorie-utile-url';
import { CategorieUtileLien } from './categorie-utile-lien';
import { Categorie } from './categorie';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { Catalogue } from './catalogue';

export class CategorieUtileBouton extends DataUtileBouton {
    constructor(utile: CategorieUtile) {
        super(utile);
    }

    get utile(): CategorieUtile {
        return this.dataUtile as CategorieUtile;
    }

    get url(): CategorieUtileUrl {
        return this.utile.url;
    }

    get lien(): CategorieUtileLien {
        return this.utile.lien;
    }

    supprime(catégorie: Categorie, quandSupprimé: (index: number, aprésSuppression: Catalogue) => void): KfBouton {
        const titre = `Suppression d'une catégorie`;
        const description = new KfEtiquette('');
        description.baliseHtml = KfTypeDeBaliseHTML.p;
        description.ajouteTextes(
            `La catégorie `,
            {
                texte: catégorie.nom,
                balise: KfTypeDeBaliseHTML.b
            },
            ' va être supprimée.'
        );
        const apiRequêteAction: ApiRequêteAction = this.utile.service.apiRequêteSupprime(catégorie, quandSupprimé);
        const bouton = Fabrique.bouton.attenteDeColonne('supprime' + catégorie.no,
            Fabrique.contenu.supprime(), apiRequêteAction, this.utile.service,
            Fabrique.confirmeModal(titre, 'danger', [description])
        );
        return bouton;
    }

}
