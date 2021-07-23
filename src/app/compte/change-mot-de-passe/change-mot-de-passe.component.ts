import { OnInit, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { PageDef } from 'src/app/commun/page-def';
import { ComptePages, CompteRoutes } from '../compte-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { CompteService } from '../compte.service';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { Identifiant } from 'src/app/securite/identifiant';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ChangeMotDePasseComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = ComptePages.changeMotDePasse;


    get titre(): string {
        return this.pageDef.titre;
    }

    identifiant: Identifiant;

    ancien: KfInputTexte;
    nouveau: KfInputTexte;
    email: KfInputTexte;

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Changer le mot de passe');
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.service.changeMotDePasse(this.valeur);
    }

    actionSiOk = (): void => {
        this.formulaire.contenus.forEach(c => {
            c.inactivité = true;
        });
        this.boutonSoumettre.visible = false;
        if (!this.identifiant) {
            const texte = new KfTexte('', 'Veuillez cliquer sur le lien pour vous connecter.');
            const def: ILienDef = {
                nom: 'Connection',
                urlDef: {
                    keys: CompteRoutes.route([ComptePages.connection.urlSegment]),
                },
                contenu: { texte: 'Connection' },
            };
            const lien = Fabrique.lien.bouton(def);
            this.afficheResultat.fixeDétails([texte, lien]);
        }
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Impossible de changer le mot de passe';
        this.titreRésultatSucces = 'Le mot de passe a bien été changé';
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        this.email = Fabrique.input.email();
        groupe.ajoute(this.email);
        let motDePasse = Fabrique.input.motDePasse(this.service.règlesDeMotDePasse, 'ancien');
        groupe.ajoute(motDePasse);
        this.ancien = motDePasse;
        motDePasse = Fabrique.input.motDePasse(this.service.règlesDeMotDePasse, 'nouveau', 'Nouveau mot de passe');
        groupe.ajoute(motDePasse);
        this.nouveau = motDePasse;

        return groupe;
    }

    ngOnInit() {
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.superGroupe = Fabrique.formulaire.superGroupe(this);
        this.identifiant = this.identification.litIdentifiant();
        if (this.identifiant) {
            this.email.valeur = this.identifiant.userName;
        }
    }

}
