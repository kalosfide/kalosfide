import { KfTypeDeComposant, KfTypeDActionDeListe } from './kf-composants-types';
import { KfConstruitUrl } from './kf-assets';

const KF_CHEMIN_DES_IMAGES = '../assets/images/';


/**
* contient les valeurs par défaut des paramètres du système des KfComposants
*/
class KfListeParDefaut {
    nomDeBase = 'item';
    id = 'id';
    nomDeBaseSelecteur = 'selecteur';
    typeSelecteur: KfTypeDeComposant = KfTypeDeComposant.bouton;
    texteSelecteur = 'Item';
    nomSelecteurNouveau = 'nouveau';
    texteSelecteurNouveau = 'Nouvel item';
    texteEtiquetteTitre = 'Items définis';
    texteListeVide = 'Aucun item défini';
    texteRienAEditer = 'Aucun item sélectionné';
    texteOk = 'Ok';
    texteAnnuler = 'Annuler';
    typesDAction: KfTypeDActionDeListe[] = [
        KfTypeDActionDeListe.ajouter,
        KfTypeDActionDeListe.editer,
        KfTypeDActionDeListe.monter,
        KfTypeDActionDeListe.descendre,
        KfTypeDActionDeListe.supprimer,
        KfTypeDActionDeListe.effacerTout
    ];
    typeDeDeclencheur: KfTypeDeComposant = KfTypeDeComposant.bouton;
    nomBouton: (type: KfTypeDActionDeListe) => string =
        (type: KfTypeDActionDeListe): string => {
            switch (type) {
                case KfTypeDActionDeListe.ajouter:
                    return 'ajouter';
                case KfTypeDActionDeListe.editer:
                    return 'editer';
                case KfTypeDActionDeListe.monter:
                    return 'monter';
                case KfTypeDActionDeListe.descendre:
                    return 'descendre';
                case KfTypeDActionDeListe.supprimer:
                    return 'supprimer';
                case KfTypeDActionDeListe.effacerTout:
                    return 'effacerTout';
                default:
                    break;
            }
        }
    texteBouton: (type: KfTypeDActionDeListe) => string =
        (type: KfTypeDActionDeListe): string => {
            switch (type) {
                case KfTypeDActionDeListe.ajouter:
                    return 'Ajouter';
                case KfTypeDActionDeListe.editer:
                    return 'Editer';
                case KfTypeDActionDeListe.monter:
                    return 'Monter';
                case KfTypeDActionDeListe.descendre:
                    return 'Descendre';
                case KfTypeDActionDeListe.supprimer:
                    return 'Supprimer';
                case KfTypeDActionDeListe.effacerTout:
                    return 'Effacer tout';
                default:
                    break;
            }
        }

}

export class KfMenuParDefaut {
    nomDeBase = 'item';
    nomDeBaseSelecteur = 'selecteur';
    typeSelecteurAClic = KfTypeDeComposant.bouton;
    typeSelecteurSansClic = KfTypeDeComposant.etiquette;
}

export class KfFichierParDefaut {
    texteSauve = 'sauvegarder les données';
    texteCharge = 'charger un fichier';
    nom = 'fichier';
    extension = 'kf';
    texteVide = 'Choisissez un fichier...';
    texteIncorrect = 'Le fichier n\'est pas valide';
    texteVérification = 'Vérification en cours';
    texteValide = 'valide';
}

export class KfParametresDesKfComposants {
    listeParDefaut = new KfListeParDefaut;

    menuParDefaut = new KfMenuParDefaut;

    fichierParDefaut = new KfFichierParDefaut;

    délaiTimeOutParDefaut = 150;

    constructeursDUrl: ((nomFichier: string) => string)[] = [KfConstruitUrl];
    urlImage(nomImage: string): string {
        let urlI: string;
        this.constructeursDUrl.find(
            (construitUrl: (nomFichier: string) => string) => {
                const url = construitUrl(nomImage);
                if (url) {
                    urlI = url;
                    return true;
                }
            }
        );
        return urlI ? urlI : nomImage;
    }
}
export const KfParametres = new KfParametresDesKfComposants;
