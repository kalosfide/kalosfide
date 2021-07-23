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
import { Identifiant } from 'src/app/securite/identifiant';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ChangeEmailComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = ComptePages.changeEmail;


    get titre(): string {
        return this.pageDef.titre;
    }

    identifiant: Identifiant;

    id: KfInputTexte;
    email: KfInputTexte;

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, `Demander le changement de l'adresse email`);
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.service.changeEmail(this.valeur);
    }

    actionSiOk = (): void => {
        this.formulaire.contenus.forEach(c => {
            c.inactivité = true;
        });
        this.boutonSoumettre.visible = false;
        this.afficheResultat.fixeDétails([
            `Vous allez recevoir un message à l'adresse ${this.email.valeur} contenant un lien vers la page de .`,
            `confirmation de la nouvelle adresse email. Vous devez utiliser ce lien pour finaliser le changement.`
        ]);
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = `Impossible de demander le changement de l'adresse email`;
        this.titreRésultatSucces = `La demande de changement de l'adresse email a bien été reçue`;
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        this.id = Fabrique.input.texteInvisible('id');
        this.id.valeur = this.identifiant.userId;
        groupe.ajoute(this.id);
        this.email = Fabrique.input.email();
        const validateur = KfValidateurs.validateurAMarque(
            'nomPris',
            'Il y a déjà un utilisateur enregistré avec cette adresse'
        );
        validateur.valeurErronée.push(this.identifiant.userName);
        this.email.ajouteValidateur(validateur);
        groupe.ajoute(this.email);

        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(() => {
            this.niveauTitre = 0;
            this.créeTitrePage();
            this.identifiant = this.identification.litIdentifiant();
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
        }));
    }

}
