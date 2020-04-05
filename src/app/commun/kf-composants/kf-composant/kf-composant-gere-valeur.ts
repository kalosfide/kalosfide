import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { KfComposant } from './kf-composant';
import { KfEntrée } from './kf-entree';
import { KfListe } from '../kf-liste/kf-liste';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfValidateur, KfValidateurs } from '../kf-partages/kf-validateur';
import { IKfVueTable, KfVueTable } from '../kf-vue-table/kf-vue-table';
import { Noeud } from '../../outils/arbre/noeud';

export type KfComposantAvecValeur = KfEntrée | KfListe | KfGroupe | IKfVueTable;

export class KfComposantGereValeur {
    icomposant: KfComposantAvecValeur;
    composant: KfComposant;
    noeudV: Noeud;
    estRacineV: boolean;
    marqueSaleQuandFixeValeur: boolean;

    /**
     * _valeur: any
     *
     *   seules les entrées et ? peuvent utiliser _valeur pour donner une valeur initiale au composant avant le passage par prépare()
     *
     *   seuls les composants éditables racine doivent définir _valeur
     *   ils le font avec la méthode initialise
     *
     *   la valeur d'un composant éditable racine qui a défini _valeur est: _valeur
     *   la valeur d'un composant éditable est indéfinie si sa racine n'a pas défini sa _valeur
     *   c'est: GroupeAvecValeur.valeur[composant.nom] si composant est le descendant d'un groupe avec valeur
     *
     */
    private pValeur: any;

    private pValidateurs: KfValidateur[];

    /**
     * typeDeValeur: TypeDeValeur
     *  détermine si le KfComposant doit avoir un AbstractControl et de quel type
     *  détermine si le KfComposant doit avoir une valeur et de quel type
     *  est fixé par le constructeur des classes dérivées non abstraites
     *  est modifié pour un groupe dont les éléments sont sans valeur
     */
    typeDeValeur: KfTypeDeValeur;

    // INTERFACE
    /**
     * pAbstractControl: AbstractControl
     *
     *   seuls les composants racine peuvent et doivent définir pAbstractControl
     *   ils le font avec la méthode initialise
     *
     *   le control d'un composant racine qui a défini pAbstractControl est: pAbstractControl
     *   le controle d'un composant est indéfini si sa racine n'a pas défini sa pAbstractControl
     *   c'est: GroupeAvecValeur.formGroup.controls[composant.nom] si composant est le descendant d'un groupe avec valeur
     *
     */
    pAbstractControl: AbstractControl;

    // INITIALISATION

    /**
     * méthode récursive du reset d'un formulaire
     *
     * situation:
     *  quand on exécute FormGroup.reset(value) sur un FormGroup qui contient un FormArray,
     *  la valeur du FormArray n'est pas rétablie
     *
     * solution: utiliser KfComposant.rétablit(valeur)
     *
     * seuls les groupes et les listes définissent rétablit
     * les groupes exécutent rétablit pour faire exécuter rétablit aux listes
     * les listes pour créer leurs contenus à partir de leurs valeurs
     *  seuls les racines utilisent le paramètre valeur passé à rétablit
     *  les autres utilisent leur ValeurDansParent
     */

    constructor(composant: KfComposantAvecValeur, typeDeValeur?: KfTypeDeValeur) {
        this.icomposant = composant;
        this.composant = composant.composant;
        this.typeDeValeur = typeDeValeur ? typeDeValeur : KfTypeDeValeur.aucun;
        this.noeudV = new Noeud();
        this.noeudV.objet = this;
    }

    // avec disposition
    ajoute(gereValeur: KfComposantGereValeur) {
        if (this.composant.type === KfTypeDeComposant.groupe) {
            this.noeudV.Ajoute(gereValeur.noeudV);
            return;
        }
        throw new Error('ajout de valeur impossible si pas groupe');
    }
    get contenus(): KfComposant[] {
        return this.noeudV.Enfants.map(e => (e.objet as KfComposantGereValeur).composant);
    }

    // ACCES AUX MEMBRES
    get parentV(): KfComposant {
        if (this.noeudV.parent) {
            return (this.noeudV.parent.objet as KfComposantGereValeur).composant;
        }
    }

    get abstractControl(): AbstractControl {
        if (this.pAbstractControl) {
            return this.pAbstractControl;
        }
        if (this.noeudV.parent) {
            const g = (this.noeudV.parent.objet as KfComposantGereValeur).composant;
            const ac = g.abstractControl as FormGroup;
            if (ac) {
                return ac.controls[this.composant.nom];
            }
            return;
        }
    }

    get valeur(): any {
        if (this.abstractControl) {
            // après l'initialisation des controles
            return this.abstractControl.value;
        }
        // avant l'initialisation des controles
        if (this.estRacineV) {
            // undefined avant l'initialisation des valeurs si this.composant n'est pas une entrée initialisée
            return this.pValeur;
        }
        if (this.noeudV.parent) {
            const g = this.noeudV.parent.objet as KfComposantGereValeur;
            if (g.valeur) {
                // après l'initialisation des valeurs
                return g.valeur[this.composant.nom];
            }
            // avant l'initialisation des valeurs
            // undefined si this.composant n'est pas une entrée avec valeur initiale
            return this.pValeur;
        }
        // avant l'initialisation des valeurs
        // undefined si this.composant n'est pas une entrée avec valeur initiale
        return this.pValeur;
    }
    set valeur(valeur: any) {
        if (this.abstractControl) {
            // après l'initialisation des controles
            if (this.marqueSaleQuandFixeValeur) {
                const ancien = this.pAbstractControl.value;
                if (ancien !== valeur) {
                    this.abstractControl.setValue(valeur);
                    this.abstractControl.markAsDirty();
                }
            } else {
                this.abstractControl.setValue(valeur);
            }
        }
        // avant l'initialisation des controles
        // on ne peut fixer la valeur initiale que des KfEntrée
        // cela n'a un effet qu'avant l'initialisation des valeurs
        if (this.composant.estEntree) {
            this.pValeur = valeur;
        }
    }

    // GROUPE

    // INITIALISATION
    /**
     * Crée la valeur et l'abstract du composant racine.
     * En passant, crée les valeurs et les controles des descendants s'il en a.
     * Fixe les validateurs
     */
    prépareRacineV() {
        if (!this.estRacineV) {
            return;
        }
        switch (this.composant.type) {
            case KfTypeDeComposant.groupe:
                this.pValeur = this.créeValeur();
                this.pAbstractControl = new FormGroup(this.créeControls());
                this.pAbstractControl.setValue(this.pValeur);
                this.fixeValidators(this.pAbstractControl);
                break;
            case KfTypeDeComposant.liste:
                this.pValeur = [];
                this.pAbstractControl = new FormArray([]);
                if (this.pValeur) {
                    this.pAbstractControl.setValue(this.pValeur);
                    this.fixeValidators(this.pAbstractControl);
                }
                break;
            default:
                const entrée = this.composant as KfEntrée;
                this.pAbstractControl = new FormControl();
                this.pAbstractControl.setValue(entrée.gereValeur.pValeur);
                this.fixeValidators(this.pAbstractControl);
                break;
        }
    }

    // pour un groupe
    private créeValeur(): any {
        const valeur = {};
        let enfant = this.noeudV.enfant;
        while (enfant) {
            const gereValeur = enfant.objet as KfComposantGereValeur;
            switch (gereValeur.composant.type) {
                case KfTypeDeComposant.groupe:
                    const groupe = gereValeur.composant as KfGroupe;
                    valeur[groupe.nom] = gereValeur.créeValeur();
                    break;
                case KfTypeDeComposant.liste:
                    const liste = gereValeur.composant as KfListe;
                    valeur[liste.nom] = [];
                    break;
                case KfTypeDeComposant.vuetable:
                    const vueTable = gereValeur.icomposant as IKfVueTable;
                    valeur[gereValeur.composant.nom] = vueTable.valeurs;
                    break;
                default:
                    if (gereValeur.composant.estEntree) {
                        const entrée = gereValeur.composant as KfEntrée;
                        valeur[entrée.nom] = gereValeur.pValeur === undefined ? null : gereValeur.pValeur;
                    }
                    break;
            }
            enfant = enfant.suivant;
        }
        return valeur;
    }

    // pour un groupe
    private créeControls(): { [key: string]: AbstractControl; } {
        const controls: { [key: string]: AbstractControl; } = {};
        let enfant = this.noeudV.enfant;
        let abstractControl: AbstractControl;
        while (enfant) {
            const gereValeur = enfant.objet as KfComposantGereValeur;
            switch (gereValeur.composant.type) {
                case KfTypeDeComposant.groupe:
                    abstractControl = new FormGroup(gereValeur.créeControls());
                    break;
                case KfTypeDeComposant.liste:
                    abstractControl = new FormArray([]);
                    break;
                case KfTypeDeComposant.vuetable:
                    const vueTable = gereValeur.icomposant as IKfVueTable;
                    abstractControl = new FormArray(vueTable.formGroups);
                    break;
                default:
                    if (gereValeur.composant.estEntree) {
                        abstractControl = new FormControl();
                        abstractControl.setValue(gereValeur.pValeur);
                    }
                    break;
            }
            controls[gereValeur.composant.nom] = abstractControl;
            gereValeur.fixeValidators(abstractControl);
            enfant = enfant.suivant;
        }
        return controls;
    }

    rétablit(valeur: any) {
        if (!this.estRacineV) {
            return;
        }
        switch (this.composant.type) {
            case KfTypeDeComposant.groupe:
                this.pValeur = valeur;
                this.recréeListes(valeur);
                break;
            case KfTypeDeComposant.liste:
                const liste = this.composant as KfListe;
                liste.remplit(liste.creeItems.recréeItems(valeur));
                break;
            default:
                this.pValeur = valeur;
                break;
        }
        this.pAbstractControl.reset(this.pValeur);
    }

    // pour un groupe
    private recréeListes(valeur: any) {
        let enfant = this.noeudV.enfant;
        while (enfant) {
            const gereValeur = enfant.objet as KfComposantGereValeur;
            switch (gereValeur.composant.type) {
                case KfTypeDeComposant.groupe:
                    gereValeur.recréeListes(valeur[gereValeur.composant.nom]);
                    break;
                case KfTypeDeComposant.liste:
                    const liste = gereValeur.composant as KfListe;
                    liste.remplit(liste.creeItems.recréeItems(valeur[liste.nom]));
                    break;
                default:
                    break;
            }
            enfant = enfant.suivant;
        }
    }

    /* VALIDATION */

    AjouteValidateur(validateur: KfValidateur) {
        if (this.pValidateurs) {
            this.pValidateurs.push(validateur);
        } else {
            this.pValidateurs = [validateur];
        }
    }

    get Validateurs(): KfValidateur[] {
        return this.pValidateurs;
    }

    FixeValidateurs(validateurs: KfValidateur[]) {
        if (this.pValidateurs) {
            this.pValidateurs = this.pValidateurs.concat(validateurs);
        } else {
            this.pValidateurs = validateurs;
        }
        const control = this.abstractControl;
        if (control) {
            this.fixeValidators(control);
        }
    }

    private fixeValidators(control: AbstractControl) {
        if (!this.pValidateurs) { return; }
        const validators = this.pValidateurs.filter(v => !!v.validatorFn).map(v => v.validatorFn);
        if (validators.length > 0) {
            control.setValidators(validators);
        }
        const asyncValidators = this.pValidateurs.filter(v => !!v.asyncValidatorFn).map(v => v.asyncValidatorFn);
        if (asyncValidators.length > 0) {
            control.setAsyncValidators(asyncValidators);
        }
    }

    private _distribueErreurs(composant: KfComposant, champ: string, distribution: {
        apiErreurs: { champ: string, code: string }[],
        messages: string[]
    }): {
        apiErreurs: { champ: string, code: string }[],
        messages: string[]
    } {
        if (composant.type === KfTypeDeComposant.groupe) {
            const groupe = composant as KfGroupe;

            groupe.contenus.forEach(c => distribution = this._distribueErreurs(c, c.nom.toLowerCase(), distribution));

        }

        if (!composant.gereValeur) {
            return distribution;
        }
        const validateurs = composant.gereValeur.Validateurs;
        if (!validateurs) {
            return distribution;
        }
        const erreurs = distribution.apiErreurs.filter(e => e.champ.toLowerCase() === champ);
        const traitées: { champ: string, code: string }[] = [];
        erreurs.forEach(e => {
            const code = e.code.toLowerCase();
            const validateur: KfValidateur = composant.gereValeur.Validateurs.find(v => code === v.nom.toLowerCase());
            if (validateur) {
                if (validateur.marqueErreur) {
                    validateur.marqueErreur(composant.abstractControl);
                    traitées.push(e);
                } else {
                    if (validateur.message) {
                        distribution.messages.push(validateur.message);
                    } else {
                        distribution.messages.push(e.code);
                    }
                }
            }
        });
        distribution.apiErreurs = distribution.apiErreurs.filter(e => !traitées.find(t => t.champ === e.champ && t.code === e.code));
        return distribution;

    }

    distribueErreurs(apiErreurs: { champ: string, code: string }[]): {
        apiErreurs: { champ: string, code: string }[],
        messages: string[]
    } {
        let distribution: {
            apiErreurs: { champ: string, code: string }[],
            messages: string[]
        } = {
            apiErreurs,
            messages: []
        };
        distribution = this._distribueErreurs(this.composant, '2', distribution);
        return distribution;
    }

    get invalide(): boolean {
        return this.abstractControl && this.abstractControl.invalid;
    }

    get erreurs(): string[] {
        const control = this.abstractControl;
        const invalide = control && !control.valid;
        if (!invalide) {
            // pas d'erreurs si pas de control ou si control est valide
            return [];
        }

        const messages: string[] = [];
        const errors = this.composant.abstractControl.errors;
        if (errors) {
            const validateurs = this.Validateurs;
            Object.keys(errors).forEach(
                key => {
                    const message = KfValidateurs.fixeMessage(validateurs, key, errors[key]);
                    messages.push(message);
                }
            );
        }
        return messages;
    }

    // MISE A JOUR

    depuisControl() {
        this.pValeur = this.pAbstractControl.value;
    }

    versControl() {
        this.rétablit(this.pValeur);
    }

}

