import { IResultatAffichable } from './resultat-affichable';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { BootstrapType, FabriqueBootstrap } from '../fabrique/fabrique-bootstrap';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { Subscription } from 'rxjs';

export class AfficheResultat {
    private pFormulaire: KfGroupe;
    private pGroupe: KfGroupe;

    private pTitre: KfEtiquette;
    private pDetails: KfEtiquette;

    private pType: BootstrapType;

    resultat: IResultatAffichable;

    constructor(formulaire: KfGroupe) {
        this.pFormulaire = formulaire;
        this.pGroupe = new KfGroupe(formulaire.nom + '-res');
        this.pGroupe.visibilitéFnc = () => {
            if (this.pType === undefined) {
                this.fixeContenus();
            }
            return !!this.resultat || !(formulaire.formGroup && formulaire.formGroup.valid);
        };

        this.pTitre = new KfEtiquette('titre');
        this.pTitre.ajouteClasseDef('font-weight-bold');
        this.pTitre.baliseHtml = KfTypeDeBaliseHTML.p;
        this.pGroupe.ajoute(this.pTitre);
        this.pDetails = new KfEtiquette('détails', '');
        this.pGroupe.ajoute(this.pDetails);
    }

    get groupe() {
        return this.pGroupe;
    }

    souscritStatut(): Subscription {
        const quandStatutChange = () => {
                this.resultat = undefined;
                if (this.pFormulaire.formGroup.invalid) {
                    this.fixeContenus();
                } else {
                    this.pDetails.contenuPhrase.contenus = [];
                }
        };
        return this.pFormulaire.abstractControl.statusChanges.subscribe(() => quandStatutChange());
    }

    commence() {
        this.resultat = undefined;
    }
    affiche(resultat?: IResultatAffichable) {
        if (!resultat) { return; }
        this.resultat = resultat;
        this.fixeContenus();
    }
    fixeContenus() {
        const détails: string[] = [];
        let type: BootstrapType;
        let titre: string;
        const formGroup = this.pFormulaire.formGroup;
        if (formGroup.errors) {
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
            FabriqueBootstrap.ajouteClasse(this.pGroupe, 'alert', type);
            this.pType = type;
        } else {
            this.pType = 'success';
        }
        if (titre) {
            this.pTitre.fixeTexte(this.resultat.titre);
        }
        this.pTitre.nePasAfficher = !titre;
        this.pDetails.contenuPhrase.contenus = détails.map(d => {
            const t = new KfTexte('', d);
            t.balisesAAjouter = [KfTypeDeBaliseHTML.p];
            return t;
        });
    }
}
