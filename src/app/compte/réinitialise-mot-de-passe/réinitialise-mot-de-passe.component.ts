import { ComptePages, CompteRoutes } from '../compte-pages';
import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ActivatedRoute } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RéinitialiseMotDePasseModel } from './réinitialise-mot-de-passe.model';
import { CompteService } from '../compte.service';
import { Observable } from 'rxjs';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { IdCodeModel } from '../id-code.model';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class RéinitialiseMotDePasseComponent  extends FormulaireComponent implements OnInit {

    pageDef: PageDef = ComptePages.réinitialiseMotDePasse;


    get titre(): string {
        return this.pageDef.titre;
    }

    kfTexteDuMotDePasse: KfInputTexte;
    idCode: IdCodeModel;

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Réinitialiser le mot de passe');
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        const valeur: RéinitialiseMotDePasseModel = {
            id: this.idCode.id,
            code: this.idCode.code,
            password: this.kfTexteDuMotDePasse.valeur
        };
        return this.service.réinitialiseMotDePasse(valeur);
    }

    actionSiOk = (): void => {
        this.formulaire.contenus.forEach(c => {
            c.inactivité = true;
        });
        this.boutonSoumettre.visible = false;
        const texte = new KfTexte('', 'Veuillez cliquer sur le lien pour vous connecter.');
        const def: ILienDef = {
            nom: 'Connection',
            urlDef: {
                keys: CompteRoutes.route([ComptePages.connection.urlSegment]),
            },
            contenu: { texte: 'Connection' },
        };
        const lien = Fabrique.lien.lien(def);
        this.afficheResultat.fixeDétails([texte, lien]);
}

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Impossible de réinitialiser le mot de passe';
        this.titreRésultatSucces = 'Le mot de passe a bien été réinitialisé';
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        this.kfTexteDuMotDePasse = Fabrique.input.motDePasse(this.service.règlesDeMotDePasse);
        groupe.ajoute(this.kfTexteDuMotDePasse);

        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe((data: {
            idCode: IdCodeModel
        }) => {
            this.niveauTitre = 0;
            this.créeTitrePage();
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
            this.idCode = data.idCode;
        }));
    }

}
