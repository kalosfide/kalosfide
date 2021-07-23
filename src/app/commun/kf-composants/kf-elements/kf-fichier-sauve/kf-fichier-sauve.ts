import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfEvenement, KfTypeDEvenement, KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfParametres } from '../../kf-composants-parametres';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfFichierSauve extends KfComposant {
    texteASauver: () => string;
    private _nomFichier: () => string;

    constructor(nom: string, texteASauver: () => string, nomFichier: () => string,
        texte?: KfStringDef,
    ) {
        super(nom, KfTypeDeComposant.fichierSauve);
        this.texteASauver = texteASauver;
        this._nomFichier = nomFichier;
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        if (texte) {
            this.fixeTexte(texte);
        } else {
            this.fixeTexte(KfParametres.fichierParDefaut.texteSauve);
        }
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        this.gereHtml.ajouteTraiteur(KfTypeDEvenement.click, () => {
            const evenement = new KfEvenement(this, KfTypeDEvenement.fichierSauve);
            this.gereHtml.traite(evenement);
        });
        this.ajouteClasse('kf-fichier kf-bouton');
    }

    get dataUrl(): string {
        return 'data:text/plain;base64,' + btoa(this.texteASauver());
    }

    get nomFichier(): string {
        let nomFichier = this._nomFichier();
        if (nomFichier === undefined || nomFichier === '') {
            nomFichier = KfParametres.fichierParDefaut.nom + KfParametres.fichierParDefaut.extension;
        }
        return nomFichier;
    }

}
