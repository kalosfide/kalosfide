import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfListe } from './kf-liste';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDActionDeListe } from '../kf-composants-types';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfParametres } from '../kf-composants-parametres';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfImageDef } from '../kf-partages/kf-image-def';
import { KfImage } from '../kf-elements/kf-image/kf-image';
import { KfTexte } from '../kf-elements/kf-texte/kf-texte';

/**
 * KfCommandesDeListeInterface
 * contient les informations nécessaires pour créer les boutons de commande
 * les descriptions des champs sont avec le constructeur de KfCommandeDeListe
 */
export interface KfCommandesDeListeInterface {
    types?: KfTypeDActionDeListe[];
    creeDeclencheur?: (type: KfTypeDActionDeListe) => KfComposant;
    texte?: (type: KfTypeDActionDeListe) => KfTexteDef;
    imageAvant?: (type: KfTypeDActionDeListe) => KfImageDef;
    imageApres?: (type: KfTypeDActionDeListe) => KfImageDef;
    type?: KfTypeDeComposant;
    position?: number;
}

interface KfCommandeDeListe {
    type: KfTypeDActionDeListe;
    declencheur: KfComposant;
}

export class KfListeCommandes {
    liste: KfListe;

    /**
     * liste des types des boutons présents dans l'ordre
     */
    types: KfTypeDActionDeListe[];

    texte: (type: KfTypeDActionDeListe) => string;

    commandes: KfCommandeDeListe[];

    /**
     * position des commandes
     */
    position: number;

    /**
     * permet de munir la liste de déclencheurs pour des actions (ajouter, supprimer, monter, descendre, ...)
     *
     * @param liste parent du gestionnaire
     * @param commandesInterface {
     *  @param types array des types des boutons devant être présents dans l'ordre
     *      valeur par défaut: LISTE_TYPES_D_ACTIONS_PAR_DEFAUT
     *  @param creeDeclencheur retourne le déclencheur de l'action du type passé en paramètre
     *      valeur par défaut: créée à partir de texte, des images et du type
     *  @param texte retourne le texte du déclencheur de l'action du type passé en paramètre
     *      valeur par défaut si imageAvant et imageApres ne sont pas définies: créée à partir de baseDesTextes
     *  @param imageAvant retourne l'imageAvant du déclencheur de l'action du type passé en paramètre
     *  @param imageApres retourne l'imageApres du déclencheur de l'action du type passé en paramètre
     *  @param type type des déclencheurs, doit être constructible par texte et images et emettre des clics
     *      valeur par défaut: LISTE_TYPE_DECLENCHEUR_PAR_DEFAUT
     * }
     */
    constructor(liste: KfListe, commandesInterface: KfCommandesDeListeInterface) {
        this.liste = liste;
        // traite les clics à la place de la liste
        this.liste.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                console.log(evenement);
                if (this.traiteClic(evenement.emetteur)) {
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
            , 'liste commandes'
        );

        commandesInterface.types = commandesInterface.types ? commandesInterface.types : KfParametres.listeParDefaut.typesDAction;
        this.commandes = commandesInterface.types
            .filter(t => this.estPrésent(t))
            .map<KfCommandeDeListe>(t => ({ type: t, declencheur: null }));
        if (!commandesInterface.texte) {
            commandesInterface.texte = KfParametres.listeParDefaut.texteBouton;
        }
        this.commandes.forEach(
            c => {
                if (commandesInterface.creeDeclencheur) {
                    c.declencheur = commandesInterface.creeDeclencheur(c.type);
                } else {
                    const nom = KfParametres.listeParDefaut.nomBouton(c.type);
                    c.declencheur = new KfBouton(nom);
                    if (commandesInterface.imageAvant) {
                        c.declencheur.contenuPhrase.ajoute(new KfImage('', commandesInterface.imageAvant(c.type)));
                    }
                    c.declencheur.contenuPhrase.ajoute(new KfTexte('', commandesInterface.texte(c.type)));
                    if (commandesInterface.imageApres) {
                        c.declencheur.contenuPhrase.ajoute(new KfImage('', commandesInterface.imageApres(c.type)));
                    }
                }
                c.declencheur.inactivitéFnc = this.inactivitéFnc(c.type);
                c.declencheur.listeParent = this.liste;
                c.declencheur.ajouteClasseDef('kf-liste-' + 'kf-' + KfParametres.listeParDefaut.nomBouton(c.type));
            }
        );
        this.position = commandesInterface.position ? commandesInterface.position : 1;
    }

    get boutons(): KfComposant[] {
        return this.commandes.map(c => c.declencheur);
    }
    get boutonNouveau(): KfComposant {
        return this.commandes.find(c => c.type === KfTypeDActionDeListe.ajouter).declencheur;
    }

    estPrésent(type: KfTypeDActionDeListe): boolean {
        switch (type) {
            case KfTypeDActionDeListe.editer:
                return !!this.liste.editions.editeur;
            case KfTypeDActionDeListe.monter:
            case KfTypeDActionDeListe.descendre:
                return !this.liste.liste.AvecOrdreAuto;
            default:
                return true;
        }
    }

    inactivitéFnc(type: KfTypeDActionDeListe): () => boolean {
        const editionEnCours = this.liste.editions.editionEnCoursFnc;
        const objetEnCours = (): boolean => {
            return this.liste.liste.index >= 0;
        };
        const enHaut = (): boolean => {
            return this.liste.liste.index === 0;
        };
        const enBas = (): boolean => {
            return this.liste.liste.index === this.liste.liste.Nb - 1;
        };
        const estVide = (): boolean => {
            return this.liste.liste.Nb === 0;
        };
        const ou = (f1: () => boolean, f2: () => boolean): (() => boolean) => {
            return (() => f1() || f2());
        };
        const et = (f1: () => boolean, f2: () => boolean): (() => boolean) => {
            return (() => f1() && f2());
        };
        const non = (f: () => boolean): (() => boolean) => {
            return (() => !f());
        };
        switch (type) {
            case KfTypeDActionDeListe.ajouter:
                return editionEnCours;
            case KfTypeDActionDeListe.editer:
                return ou(editionEnCours, non(objetEnCours));
            case KfTypeDActionDeListe.monter:
                return ou(editionEnCours, ou(non(objetEnCours), enHaut));
            case KfTypeDActionDeListe.descendre:
                return ou(editionEnCours, ou(non(objetEnCours), enBas));
            case KfTypeDActionDeListe.supprimer:
                return ou(editionEnCours, non(objetEnCours));
            case KfTypeDActionDeListe.effacerTout:
                return ou(editionEnCours, estVide);
            default:
                break;
        }
    }

    // ACTIONS
    ajouteNouveau() {
        this.liste.ajoute(this.liste.creeItems.creeItem());
    }

    traiteClic = (emetteur: KfComposant): boolean => {
        const commande = this.commandes.find(c => c.declencheur === emetteur);
        let action: () => void;
        if (commande) {
            switch (commande.type) {
                case KfTypeDActionDeListe.ajouter:
                    if (!this.liste.editions.gereAjout()) {
                        action = () => this.ajouteNouveau();
                    }
                    break;
                case KfTypeDActionDeListe.editer:
                    this.liste.editions.editeur.activeEdition();
                    break;
                case KfTypeDActionDeListe.monter:
                    action = () => this.liste.monte();
                    break;
                case KfTypeDActionDeListe.descendre:
                    action = () => this.liste.descend();
                    break;
                case KfTypeDActionDeListe.supprimer:
                    action = () => this.liste.supprime();
                    break;
                case KfTypeDActionDeListe.effacerTout:
                    action = () => this.liste.effaceTout();
                    break;
                default:
                    break;
            }
            if (action) {
                action();
                this.liste.quandListeChange();
            }
        }
        return true;
    }

}
