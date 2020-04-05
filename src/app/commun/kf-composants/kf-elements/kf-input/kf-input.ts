import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfBouton } from '../kf-bouton/kf-bouton';
import { KfTypeDEvenement, KfEvenement } from '../../kf-partages/kf-evenements';
import { KfIcone } from '../kf-icone/kf-icone';

export enum KfTypeDInput {
    date = 'date',
    temps = 'time',
    datetemps = 'datetemps',
    email = 'email',
    nombre = 'number',
    password = 'password',
    texte = 'text',
}

export abstract class KfInput extends KfEntrée {
    // données
    texteParDéfaut: '';
    abstract typeDInput: string;
    composantAvant: KfComposant;
    boutonEfface: KfBouton;

    /**
     * pour l'attribut placeholder
     */
    placeholder: string;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.input);
        this.contenuPhrase = new KfContenuPhrase(this, texte);

        this.ajouteClasseDef(
            'form-control',
            { nom: 'position-static', active: () => !this.contenuPhrase },
            { nom: 'is-invalid', active: () => this.erreurs.length > 0 },
        );
        const estDansVueTable = () => this.estDansVueTable;
        this.géreClasseLabel.ajouteClasseDef(
            { nom: 'kf-invisible', active: estDansVueTable }
        );
    }

    créeBoutonEfface() {
        this.géreClasseEntree.ajouteClasseDef({ nom: 'kf-input-vide', active: () => this.estVide });
        this.boutonEfface = new KfBouton('efface_' + this.nom);
        this.boutonEfface.ajouteClasseDef('kf-input-efface-bouton');
    }
    get estVide(): boolean {
        const valeur = this.litValeur();
        return valeur === null || valeur === undefined || valeur === '';
    }
    efface() {
        this.fixeValeur(null);
    }

}
