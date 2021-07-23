import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfSuperGroupe } from '../../kf-groupe/kf-super-groupe';
import { KfParametres } from '../../kf-composants-parametres';
import { KfFichier } from '../kf-fichier/kf-fichier';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { litFichierTexte } from 'src/app/commun/outils/lit-fichier-texte';
import { KfEvenement } from '../../kf-partages/kf-evenements';

export interface KfResultatFichierCharge {
    file: File;
    erreur?: any;
    texte?: string;
}

export class KfFichierCharge extends KfFichier {

    superGroupe: KfSuperGroupe;
    decodeSelecteur: (selecteur: any) => KfSuperGroupe;

    /**
     * contient un KfFichier. Quand le KfFichier émet fichiersChoisis, lit le contenu du fichier
     * et vérifie qu'il permet d'affecter une valeur à un superGroupe.
     * Si oui, transforme fichiersChoisis en fichierCharge avec pour parametres un object de membres superGroupe et valeur
     * @param nom identifiant unique du composant dans le groupe parent
     * @param extension extension du fichier, si non défini: ParametresDesKfComposants.fichierParDefaut.extension
     * @param texte texte du bouton
     * @param imageAvant image du bouton
     * @param imageApres image du bouton
     */
    constructor(nom: string, extension?: string, texte?: KfStringDef, ) {
        super(nom, KfTypeDeComposant.fichierCharge);
        this.typesExtension.push(extension ? extension : KfParametres.fichierParDefaut.extension);
        this.multiple = false;
    }

    quandChange(evenement: KfEvenement) {
        this._quandChange()
        const resultat: KfResultatFichierCharge = { file: this.files[0] };
        const subsbscription = litFichierTexte(this.files[0]).subscribe({
            next: texte => {
                subsbscription.unsubscribe();
                resultat.texte = texte;
                evenement.parametres = resultat;
            },
            error: err => {
                subsbscription.unsubscribe();
                resultat.erreur = err;
                evenement.parametres = resultat;
            }
        });
    }

}
