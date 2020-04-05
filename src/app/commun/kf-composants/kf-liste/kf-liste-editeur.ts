import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { KfListe } from './kf-liste';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement, KfTraitementDEvenement } from '../kf-partages/kf-evenements';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeBouton, KfTypeDeBaliseHTML, KfTypeDeComposant } from '../kf-composants-types';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfParametres } from '../kf-composants-parametres';
import { KfListeEditions } from './kf-liste-editions';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';

export class KfListeEditeur extends KfSuperGroupe {

    /**
     * parent du gestionnaire
     */
    editions: KfListeEditions;
    /**
     * si défini, une KfEtiquette sera ajoutée
     */
    etiquetteTitre: KfEtiquette;
    /**
     * item édité avant d'être ajouté à la liste
     */
    itemEdité: object;
    /**
     * valeur d'un item à la création
     */
    private valeurNouveau: any;
    /**
     * bouton Ok montré lors de l'édition d'un élément à ajouter
     */
    get boutonOk(): KfBouton { return this.editions.boutonOk; }
    /**
     * bouton Annuler montré lors de l'édition d'un élément à ajouter
     */
    get boutonAnnuler(): KfBouton { return this.editions.boutonAnnuler; }

    _editionEnCours: boolean;

    constructor(editions: KfListeEditions) {
        super(editions.liste.nom);
        this.type = KfTypeDeComposant.listeEditeur;
        this.créeGereValeur();
        this.editions = editions;
        this.itemEdité = editions.liste.creeItems.creeItem();
        this.valeurNouveau = this.composant.gereValeur.valeur;
        if (editions.etiquetteTitre) {
            this.etiquetteTitre = editions.etiquetteTitre(null);
            this.etiquetteTitre.fixeTexte(() => {
                let i = editions.liste.itemChoisi;
                if (!i) {
                    i = editions.itemNouveau;
                }
                return editions.titre(i);
            });
        }
        this.quandTousAjoutés();
        this.désactiveEdition();
        this.liste.liste.AbonneAIndexChangé(() => this.quandIndexChange());
    }

    get liste(): KfListe {
        return this.editions.liste;
    }

    get composant(): KfComposant {
        return this.liste.creeItems.composant(this.itemEdité);
    }

    get itemAEditer(): object {
        return this.editions.itemNouveau ? this.editions.itemNouveau : this.liste.itemChoisi;
    }
    get composantAEditer(): KfComposant {
        return this.liste.creeItems.composant(this.itemAEditer);
    }

    quandIndexChange() {
        this.composant.gereValeur.rétablit(this.liste.creeItems.valeur(this.itemAEditer));
    }

    désactiveEdition() {
        this._editionEnCours = false;
        if (this.editions.enTete) {
            this.editions.enTete.désactive();
        }
        this.composant.désactive();
        if (this.boutonAnnuler) {
            this.boutonAnnuler.désactive();
        }
        console.log('désactiveEdition');
    }

    activeEdition() {
        console.log('activeEdition', this);
        this._editionEnCours = true;
        if (this.editions.itemNouveau) {
            this.composant.gereValeur.rétablit(this.liste.creeItems.valeur(this.editions.itemNouveau));
        }
        if (this.editions.enTete) {
            this.editions.enTete.active();
        }
        this.composant.active();
        this.boutonAnnuler.active();
    }

    get editionEnCours(): boolean {
        return this._editionEnCours;
    }

    quandEvenementEnTete(evenement: KfEvenement) {
        this.editions.quandEvenementEnTete(this.itemEdité, evenement);
    }

    traiteOk(evenement: KfEvenement) {
        this.désactiveEdition();
        this.composant.gereValeur.depuisControl();
        this.composantAEditer.gereValeur.rétablit(this.composant.gereValeur.valeur);
        if (this.editions.itemNouveau) {
            evenement.emetteur = this;
            this.editions.traiteOk(evenement);
        }
    }

    traiteAnnuler(evenement: KfEvenement) {
        this.désactiveEdition();
        if (this.editions.itemNouveau) {
            evenement.emetteur = this;
            this.editions.traiteAnnuler(evenement);
        } else {
            this.composant.gereValeur.rétablit(this.liste.valeur[this.liste.liste.index]);
        }
    }

    messagePeutQuitter(): string {
        if (this.editionEnCours && !this.composant.abstractControl.pristine) {
            return this.etiquetteTitre.texte + ': Abandonner ' + (this.editions.itemNouveau
                ? 'l\'ajout?' : 'la modification?');
        }
    }

}
