import { OnDestroy } from '@angular/core';


import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { DataService } from '../../services/data.service';

import { FormulaireBaseComponent } from './formulaire-base.component';
import { EtapeDeFormulaire, EtapeDeFormulaireEditeur } from './etape-de-formulaire';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { ResultatAction } from 'src/app/disposition/affiche-resultat/resultat-affichable';
import { FormulaireAEtapeService } from './formulaire-a-etapes.service';
import { PageDef } from 'src/app/commun/page-def';
import { Observable } from 'rxjs';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { Fabrique } from '../fabrique/fabrique';
import { IBoutonDef } from '../fabrique/fabrique-bouton';
import { GroupeBoutonsMessages } from '../fabrique/fabrique-formulaire';

export interface IFormulaireAEtapes {
    etapes: EtapeDeFormulaire[];
    superGroupe: KfSuperGroupe;
    formulaire: KfGroupe;
    fixeIndex: (index: number) => void;
}

// TODO: Add Angular decorator.
export abstract class FormulaireAEtapesComponent extends FormulaireBaseComponent implements IFormulaireAEtapes, OnDestroy {
    titrePage: KfSuperGroupe;

    etapes: EtapeDeFormulaire[] = [];
    index: number;

    nomPrecedent = 'precedent';
    textePrecedent = 'Précédent';
    nomSuivant = 'suivant';
    texteSuivant = 'Suivant';

    nomSoumettre = 'soumettre';
    texteSoumettre = 'Terminer';

    abstract construitUrl(routeEtape: string): string;

    constructor(
        protected service: DataService,
        protected etapesService: FormulaireAEtapeService,
        protected peutQuitterService: PeutQuitterService
    ) {
        super(service);
    }

    peutQuitter = (): boolean | Observable<boolean> | Promise<boolean> => {
        if (this.superGroupe.formGroup.pristine) {
            return true;
        }
        return this.peutQuitterService.confirme(this.pageDef.titre);
    }

    ajouteEtape(pageDef: PageDef, éditeur: EtapeDeFormulaireEditeur) {
        const etape = new EtapeDeFormulaire(this.etapes.length, pageDef, éditeur);
        etape.parent = this;
        this.etapes.push(etape);
    }

    fixeIndex(index: number) {
        this.index = index;
    }

    url(etape: EtapeDeFormulaire): string {
        let e = etape;
        if (this.inactive(e)) {
            e = this.etapes[this.index];
        }
        if (!e) {
            e = this.etapes[0];
        }
        return this.construitUrl(e.pageDef.urlSegment);
    }

    choisie(etape: EtapeDeFormulaire): boolean {
        return this.index === etape.index;
    }

    private valideJusquA(index: number): boolean {
        let i = 0;
        for (; i < index; i++) {
            if (!this.etapes[i].estValide) {
                return false;
            }
        }
        return this.etapes[index].estValide;
    }

    inactive(etape?: EtapeDeFormulaire): boolean {
        return !(etape.index === 0 || this.valideJusquA(etape.index - 1));
    }

    nomNav(etape?: EtapeDeFormulaire): string {
        return etape.nom + 'nav';
    }

    créeBoutonPrécédent(index: number): KfBouton {
        const def: IBoutonDef = {
            nom: this.nomPrecedent + index,
            contenu: { texte: this.textePrecedent },
            action: (evenement: KfEvenement) => evenement.parametres = index - 1
        };
        const bouton = Fabrique.bouton.bouton(def);
        return bouton;
    }

    créeBoutonSuivant(index: number): KfBouton {
        const def: IBoutonDef = {
            nom: this.nomSuivant + index,
            contenu: { texte: this.texteSuivant },
            action: () => this.routeur.navigate([this.url(this.etapes[index + 1])])
        };
        const bouton = Fabrique.bouton.bouton(def);
        return bouton;
    }

    créeBoutons(index: number): KfBouton[] {
        if (index === 0) {
            return [this.créeBoutonSuivant(0)];
        }
        if (index < this.etapes.length - 1) {
            return [this.créeBoutonPrécédent(index), this.créeBoutonSuivant(index)];
        }
        this.boutonSoumettre = Fabrique.bouton.soumettre(this.superGroupe, this.texteSoumettre);
        return [this.créeBoutonPrécédent(index), this.boutonSoumettre];
    }

    contenusValidationParDéfaut(): KfComposant[] {
        return this.etapes.map(e => e.créeGroupeEtat());
    }

    protected créeFormulaire() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();

        this.formulaire = new KfGroupe(this.nom);
        this.formulaire.créeGereValeur();
        for (let i = 0; i < this.etapes.length; i++) {
            const etape = this.etapes[i];
            etape.créeEdition();
            if (i < this.etapes.length - 1) {
                const btnsMsgs = new GroupeBoutonsMessages(etape.nom, { boutons: [this.créeBoutonSuivant(i)] });
                etape.groupeEditeur.ajoute(btnsMsgs.groupe);
            } else {
                this.boutonSoumettre = Fabrique.bouton.soumettre(this.superGroupe, this.texteSoumettre);
                const btnsMsgs = new GroupeBoutonsMessages(etape.nom, { boutons: [this.boutonSoumettre] });
                etape.groupeEditeur.ajoute(btnsMsgs.groupe);
                this.afficheResultat = Fabrique.formulaire.ajouteResultat(this.superGroupe);
                etape.groupeEditeur.ajoute(this.afficheResultat.groupe);
            }
            this.formulaire.ajoute(etape.groupeEditeur);
        }

        this.superGroupe.ajoute(this.formulaire);
        this.superGroupe.comportementFormulaire = { sauveQuandChange: true };
        this.superGroupe.gereHtml.ajouteTraiteur(KfTypeDEvenement.click, (evenement: KfEvenement) => {
            if (evenement.emetteur === this.boutonSoumettre) {
                this.soumet();
            }
        });
        this.superGroupe.gereHtml.ajouteTraiteur(KfTypeDEvenement.submit, (evenement: KfEvenement) => {
            if (evenement.emetteur === this.boutonSoumettre) {
                this.soumet();
            }
        });
        this.superGroupe.quandTousAjoutés();
    }

    ngOnInit_Index() {
        this.index = 0;
        this.etapesService.initialise(this);
        this.etapesService.index$().subscribe((index: number) => {
            this.index = index;
            for (let i = 0; i < this.etapes.length; i++) {
                const etape = this.etapes[i];
                etape.groupeEditeur.visible = i === index;
            }
        });
    }

    ngOnDestroy() {
        this.etapesService.termine();
        this.ngOnDestroy_Subscriptions();
    }

    actionSiErreur = (resultat: ResultatAction) => {
        if (!resultat.ok) {
            if (!this.superGroupe.formGroup.valid) {
                // TODO
                // marquer les erreurs de validation a posteriori dans les étapes
                // mettre des liens vers les étapes avec erreur
            }
        }
    }

    traite(evenement: KfEvenement) {
        switch (evenement.type) {
            case KfTypeDEvenement.submit:
                this.soumet();
                break;
            case KfTypeDEvenement.click:
                const index: number = evenement.parametres;
                this.routeur.navigate([this.url(this.etapes[index])]);
                break;
            default:
                break;
        }
    }

}
