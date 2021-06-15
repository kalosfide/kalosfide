import { KfGroupe } from './kf-groupe';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfInput } from '../kf-elements/kf-input/kf-input';
import { KfInputDateTemps } from '../kf-elements/kf-input/kf-input-date-temps';
import { IKfVueTable } from '../kf-vue-table/kf-vue-table';
import { KfTypeDInput } from '../kf-elements/kf-input/kf-type-d-input';
import { KfEvenement, KfStatutDEvenement, KfTypeDEvenement, KfTypeDHTMLEvents } from '../kf-partages/kf-evenements';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfDivTableLigne } from './kf-div-table';

/**
 * racine d'un arbre de disposition
 */
export class KfSuperGroupe extends KfGroupe {

    constructor(nom: string) {
        super(nom);
    }

    /**
     * les composants sont ajoutés dans la disposition
     * les noeudV sont créés avec les géreValeur
     * les racineV sont désignés
     * les noeudV des composants ayant été ajoutés à la valeur d'un composant ont un parent
     *
     * Il faut:
     *  créer la liste des racineV
     *  ajouter un noeudV qui n'est pas une racineV et qui n'a pas de parentV au noeudV
     *  du plus proche ancêtre de disposition qui en a un
     *  lancer gereValeur.prepare pour chaque racine
     * Pour la disposition insérer dans des balises
     */
    quandTousAjoutés() {
        /**
         * Racines des arbres de valeur contenus dans l'arbre de disposition du superGroupe
         */
        const racinesDeValeur: KfComposant[] = [];
        const boutonsHorsFormulaire: KfBouton[] = [];
        /**
         * 
         * Fonction récursive qui passe d'un composant à ses enfants dans l'arbre de disposition.
         * @param composant descendant dans l'arbre de disposition
         * @param parentV feuille de l'arbre des valeurs
         */
        const créeArbresDeValeurs = (composant: KfComposant, parentV: KfComposantGereValeur) => {
            // feuille de l'arbre des valeurs pour les descendants du composant
            let pV = parentV;
            /** debug */
            if (!composant) {
                console.error(parentV);
            }
            if (composant.gereValeur) {
                // Le composant a une valeur, il doit figurer dans un arbre des valeurs
                if (composant.gereValeur.estRacineV) {
                    // Le composant est racine pour la valeur, il faut créer son arbre des valeurs
                    racinesDeValeur.push(composant);
                    // Ses descendants avec valeur doivent être attachés à son gereValeur
                    pV = composant.gereValeur;
                } else {
                    // Le composant n'est pas racine pour la valeur, on l'ajoute à la feuille en cours
                    parentV.ajoute(composant.gereValeur);
                    if (composant.estGroupe) {
                        // Le composant est un groupe, ses descendants avec valeur doivent être attachés à son gereValeur
                        pV = composant.gereValeur;
                    } else {
                        if (composant.type === KfTypeDeComposant.input) {
                            // cas particulier
                            if ((composant as KfInput).typeDInput === KfTypeDInput.datetemps) {
                                const datetemps = composant as KfInputDateTemps;
                                créeArbresDeValeurs(datetemps.inputDate, null);
                                créeArbresDeValeurs(datetemps.inputTemps, null);
                            }
                        }
                    }
                }
            }
            if (composant.type === KfTypeDeComposant.vuetable) {
                // Une vueTable peut avoir dans ses outils ou sa pagination des composants avec valeur qu'il faut initialiser
                const vueTable = composant as unknown as IKfVueTable;
                if (vueTable.groupesAvecControls) {
                    vueTable.groupesAvecControls.forEach(g => créeArbresDeValeurs(g, null));
                }
            }
            if (composant.type === KfTypeDeComposant.bouton) {
                const bouton = composant as KfBouton;
                if (bouton.typeDeBouton === 'button') {
                    // Un bouton de type button doit déclencher l'événement click
                    this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
                } else {
                    // Un bouton de type submit ou reset ne doit pas déclencher l'événement click
                    if (bouton.formulaire && bouton.formulaire !== bouton.formulaireParent) {
                        // Le bouton est en dehors du formulaire à soumettre ou réinitialier
                        // Il faudra ajouter des attributs form
                        boutonsHorsFormulaire.push(bouton);
                    }
                    
                }
            }
            const noeudD = composant.noeud;
            let enfant = noeudD.enfant;
            while (enfant) {
                créeArbresDeValeurs(enfant.objet as KfComposant, pV);
                enfant = enfant.suivant;
            }
            if (composant.type === KfTypeDeComposant.groupe) {
                const groupe = composant as KfGroupe;
                const créeArbresDeValeursLigne = (divLigne: KfDivTableLigne) => {
                        divLigne.colonnes.forEach(divColonne => {
                            if (divColonne.composants) {
                                divColonne.composants.forEach(composant => créeArbresDeValeurs(composant, pV));
                            }
                        });
                    }
                if (groupe.divTable) {
                    groupe.divTable.lignes.forEach(divLigne => créeArbresDeValeursLigne(divLigne));
                }
                if (groupe.divLigne) {
                    créeArbresDeValeursLigne(groupe.divLigne);
                }
            }
        };

        if (this.gereValeur) {
            this.gereValeur.estRacineV = true;
        }
        // crée la liste des racines des arbres de valeur contenus dans le superGroupe
        créeArbresDeValeurs(this, null);

        const formulaires = racinesDeValeur.filter(rv => rv.type === KfTypeDeComposant.groupe);
        const formulairesAvecBoutonsHorsFormulaire = formulaires.filter(f => boutonsHorsFormulaire.find(b => b.formulaire === f));
        // les formulaires qui ont un bouton de type submit ou reset dehors doivent avoir un nom unique et non vide
        const noms: string[] = [''];
        // fixe l'attribut id des formulaires qui ont un bouton de type submit ou reset dehors
        formulairesAvecBoutonsHorsFormulaire.forEach(f => {
            const nom = noms.find(n => n === f.nom);
            if (nom !== undefined) {
                throw new Error(`Les formulaires qui ont un bouton de type submit ou reset dehors doivent avoir un nom et un nom unique dans le document.`);
            }
            f.gereHtml.fixeAttribut('id', f.nom);
        })
        // fixe l'attribut form des boutons de type submit ou reset qui ne sont pas dans leur formulaire
        boutonsHorsFormulaire.forEach(bouton => {
            const formulaire = formulaires.find(f => f === bouton.formulaire);
            if (formulaire) {
                bouton.gereHtml.fixeAttribut('form', formulaire.nom);
            }
        })

        // supprime des arbres de valeur les groupes dont la valeur est un objet vide

        racinesDeValeur.forEach(racineV => {
            // crée les valeurs et les controles, fixe les validateurs
            racineV.gereValeur.prépareRacineV();
            // fixe les événements concernant la valeur
            if (racineV.type === KfTypeDeComposant.groupe) {
                const groupe = racineV.composant as KfGroupe;
                const géreHtml = groupe.gereHtml;
                const géreValeur = groupe.gereValeur;
                if (groupe.comportementFormulaire) {
                    if (groupe.comportementFormulaire.sauveQuandChange) {
                        géreHtml.suitLaValeur();
                        géreHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                            (e: KfEvenement) => {
                                géreHtml.actionSansSuiviValeur(() => géreValeur.depuisControl())();
                                e.statut = KfStatutDEvenement.fini;
                            }
                        );
                    }
                    if (groupe.comportementFormulaire.traiteReset) {
                        géreHtml.ajouteTraiteur(KfTypeDEvenement.reset,
                            (e: KfEvenement) => {
                                géreValeur.versControl();
                                e.statut = KfStatutDEvenement.fini;
                            }
                        );
                    }
                    if (groupe.comportementFormulaire.traiteSubmit) {
                        géreHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.submit);
                        géreHtml.ajouteTraiteur(KfTypeDEvenement.submit,
                            (e: KfEvenement) => {
                                géreValeur.depuisControl();
                                groupe.comportementFormulaire.traiteSubmit.traitement();
                                e.statut = KfStatutDEvenement.fini;
                            }
                        );
                    }
                }
            }
        });
    }
}
