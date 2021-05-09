import { OnInit, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { PageDef } from 'src/app/commun/page-def';
import { ComptePages } from '../compte-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { CompteService } from '../compte.service';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class OubliMotDePasseComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = ComptePages.oubliMotDePasse;


    get titre(): string {
        return this.pageDef.titre;
    }

    email: KfInputTexte;

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Demander la réinitialisation du mot de passe');
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.service.oubliMotDePasse(this.valeur);
    }

    actionSiOk = (): void => {
        this.formulaire.contenus.forEach(c => {
            c.inactivité = true;
        });
        this.boutonSoumettre.visible = false;
        this.afficheResultat.fixeDétails([
            `Vous allez recevoir un message à l'adresse ${this.email.valeur} contenant un lien vers la page de
            réinitialisation du mot de passe. Vous devez utiliser ce lien pour réinitialiser votre mot de passe.`
        ]);
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Impossible de demander la réinitialisation du mot de passe';
        this.titreRésultatSucces = 'La demande de réinitialisation du mot de passe a bien été reçue';
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        this.email = Fabrique.input.email();
        groupe.ajoute(this.email);

        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(() => {
            this.niveauTitre = 0;
            this.créeTitrePage();
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
        }));
    }

}
