import { OnInit, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { PageDef } from 'src/app/commun/page-def';
import { ComptePages } from '../compte-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { CompteService } from '../compte.service';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class AjouteComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = ComptePages.ajoute;


    get titre(): string {
        return this.pageDef.titre;
    }

    email: KfInputTexte;

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Créer le compte');
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.service.ajoute(this.valeur);
    }

    actionSiOk = (): void => {
        this.formulaire.contenus.forEach(c => {
            c.inactivité = true;
        });
        this.boutonSoumettre.visible = false;
        this.afficheResultat.fixeDétails([
            `Vous allez recevoir un message à l'adresse ${this.email.valeur} contenant un lien vers la page de confirmation de l'email.`,
            `Vous devez utiliser ce lien pour confirmer l'adresse email avant de pouvoir vous connecter.`
        ]);
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Impossible de créer le compte';
        this.titreRésultatSucces = 'Le compte a bien été créé';
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        this.email = Fabrique.input.email();
        this.email.ajouteValidateur(KfValidateurs.validateurAMarque(
            'nomPris',
            'Il y a déjà un utilisateur enregistré avec cette adresse.'
        ));
        groupe.ajoute(this.email);
        const motDePasse = Fabrique.input.motDePasse(this.service.règlesDeMotDePasse);
        groupe.ajoute(motDePasse);

        return groupe;
    }

    ngOnInit() {
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.superGroupe = Fabrique.formulaire.superGroupe(this);
    }

}
