import { IResultatAffichable } from './resultat-affichable';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { BootstrapType, KfBootstrap, BootstrapNom } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { Subscription } from 'rxjs';
import { KfContenuPhrase, KfTypeContenuPhrasé } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { TypeAlerte } from '../alerte/alerte';

/**
 * Permet l'affichage du résultat de la soumission d'un formulaire
 */
export class AfficheResultat {
    private pFormulaire: KfGroupe;
    private pGroupe: KfGroupe;

    private pTitre: KfEtiquette;
    private pDetails: KfEtiquette;

    private pType: BootstrapType;

    resultat: IResultatAffichable;

    /**
     * Crée un groupe contenant une étiquette pour le titre et une pour les détails
     * @param formulaire formulaire dont le résultat de la soumission est à afficher
     */
    constructor(formulaire: KfGroupe) {
        this.pFormulaire = formulaire;
        this.pGroupe = new KfGroupe(formulaire.nom + '-res');
        /*
        this.pGroupe.visibilitéFnc = () => {
            if (this.pType === undefined) {
                this.fixeContenus();
            }
            // visible si le résultat existe
            return !!this.resultat || !(formulaire.formGroup && formulaire.formGroup.valid);
        };
        */

        this.pTitre = new KfEtiquette('titre');
        this.pTitre.ajouteClasse('font-weight-bold');
        this.pTitre.baliseHtml = KfTypeDeBaliseHTML.p;
        this.pGroupe.ajoute(this.pTitre);
        this.pDetails = new KfEtiquette('détails', '');
        this.pGroupe.ajoute(this.pDetails);
    }

    get groupe() {
        return this.pGroupe;
    }

    /**
     * Efface le résultat s'il y en a un.
     * Rend le groupe invisible.
     */
    commence() {
        this.resultat = undefined;
        this.pGroupe.visible = false;
    }
    affiche(resultat?: IResultatAffichable) {
        if (!resultat) { return; }
        this.resultat = resultat;
        this.fixeContenus();
        this.pGroupe.visible = true;
        if (resultat.typeAlert !== BootstrapNom.success) {
            const subscription = this.pFormulaire.formGroup.valueChanges.subscribe(() => {
                this.pGroupe.visible = false;
                subscription.unsubscribe();
            });
        }
    }
    fixeContenus() {
        const détails: string[] = [];
        let type: BootstrapType;
        let titre: string;
        const formGroup = this.pFormulaire.formGroup;
        if (formGroup && formGroup.errors) {
            Object.keys(formGroup.errors).forEach(key => {
                const v = formGroup.errors[key];
                détails.push(v.value);
            });
            type = 'danger';
        }
        if (this.resultat) {
            type = this.resultat.typeAlert;
            titre = this.resultat.titre;
            if (this.resultat.détails) {
                this.resultat.détails.forEach(d => détails.push(d));
            }
        }
        if (type) {
            KfBootstrap.ajouteClasse(this.pGroupe, 'alert', type);
            this.pType = type;
        } else {
            this.pType = 'success';
        }
        if (titre) {
            this.pTitre.fixeTexte(this.resultat.titre);
        }
        this.pTitre.nePasAfficher = !titre;
        this.pGroupe.nePasAfficher = !titre && détails.length === 0;
        this.pDetails.contenuPhrase.contenus = détails.map(d => {
            const t = new KfTexte('', d);
            t.balisesAAjouter = [KfTypeDeBaliseHTML.p];
            return t;
        });
    }

    fixeDétails(détails: (string | KfTypeContenuPhrasé)[]) {
        this.pDetails.contenuPhrase.contenus = détails.map(d => {
            if (typeof (d) === 'string') {
                const t = new KfTexte('', d);
                t.balisesAAjouter = [KfTypeDeBaliseHTML.p];
                return t;
            } else {
                return d;
            }
        });
    }
}
