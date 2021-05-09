import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { KfUlComposant } from '../commun/kf-composants/kf-ul/kf-ul-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { AppSite } from '../app-site/app-site';

export class CompteUtile {
    avertissement(texteBouton: string, action: string): KfGroupe {
        const groupe = new KfGroupe('avertissement');
        let étiquette: KfEtiquette;
        étiquette = Fabrique.ajouteEtiquetteP();
        Fabrique.ajouteTexte(étiquette,
            `${action} comporte trois étapes:`
        );
        groupe.ajoute(étiquette);
        const ulli = new KfUlComposant('');
        étiquette = new KfEtiquette('');
        Fabrique.ajouteTexte(étiquette,
            `Vous remplissez le formulaire et cliquez sur le bouton`,
            { texte: texteBouton, balise: KfTypeDeBaliseHTML.b, suiviDeSaut: true },
        );
        ulli.ajoute(étiquette);
        étiquette = new KfEtiquette('');
        Fabrique.ajouteTexte(étiquette,
            `${AppSite.nom} vous envoie un mail contenant un lien vers la page de confirmation`,
        );
        ulli.ajoute(étiquette);
        étiquette = new KfEtiquette('');
        Fabrique.ajouteTexte(étiquette,
            `Vous ouvrez la page de confirmation en utilisant ce lien`,
        );
        ulli.ajoute(étiquette);
        groupe.ajoute(ulli);

        return groupe;
    }

    ajouteEmail(groupe: KfGroupe, texteBouton: string, action: string) {
        const avertissement = Fabrique.ajouteEtiquetteP();
        Fabrique.ajouteTexte(avertissement,
            `Quand vous cliquerez sur le bouton`,
            { texte: texteBouton, balise: KfTypeDeBaliseHTML.b },
            `un message sera envoyé à l'adresse email`
            )
    }
}
