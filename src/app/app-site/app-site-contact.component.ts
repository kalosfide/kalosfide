import { Component } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { AppSitePages } from './app-site-pages';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { AppSite } from './app-site';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { Dateur } from '../commun/outils/dateur';
import { KfInputDateTemps } from '../commun/kf-composants/kf-elements/kf-input/kf-input-date-temps';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { IKfBootstrapOptions, KfBootstrap } from '../commun/kf-composants/kf-partages/kf-bootstrap';
import { Fabrique } from '../disposition/fabrique/fabrique';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSiteContactComponent extends PageBaseComponent {

    pageDef: PageDef = AppSitePages.contact;

    get titre(): string {
        return `Contacter ${AppSite.titre}`;
    }

    constructor() {
        super();
        this.créeContenus();
    }

    créeEdition(): KfGroupe  {
        const info = (input: KfInputTexte)  => ({
            nom: input.nom,
            div: input.classeDiv,
            composantAvant: input.composantAvant,
            entrée: input.classeEntree,
            input: input.classe,
            btIcone: input.ajouteCssDivBouton
        })
        const créeInput: (nom: string, options?: IKfBootstrapOptions) => KfInputTexte = (nom: string, options?: IKfBootstrapOptions) => {
            const input = Fabrique.input.texte(nom, `Label (${nom})`, `Placeholder (${nom})`);
            input.valeur = '123456 ' + nom;
            input.ajouteEffaceur(Fabrique.icone.def.croix);
            if (options) {
                options.classeDiv = 'mb-3';
                KfBootstrap.prépareInput(input, options);
            }
            return input;
        }

        const groupe = Fabrique.formulaire.formulaire();
        let nom: string;
        let input: KfInputTexte;

        nom = 'defaut';
        input = créeInput(nom, {
//            taille: 'lg',
            texteBrutSiLectureSeule: true,
        });
        groupe.ajoute(input);
        console.log(info(input));

        nom = 'flottant';
        input = créeInput(nom, {
            taille: 'lg',
            label: 'labelFlottant',
        });
        groupe.ajoute(input);
        console.log(info(input));

        nom = 'colonne';
        input = créeInput(nom, {
            taille: 'lg',
            label: { breakpoint: 'sm', width: 2 }
        });
        groupe.ajoute(input);
        console.log(info(input));

        nom = 'dansGroupe';
        input = créeInput(nom);
        let étiquette = new KfEtiquette('dansGroupe');
        const icone = Fabrique.icone.icone(Fabrique.icone.def.filtre);
        étiquette.contenuPhrase.fixeContenus(icone);
        input.fixeComposantAvant(étiquette);
        input.lectureSeule = true;
        KfBootstrap.prépare(input, {
            taille: 'lg',
            dansInputGroup: true,
            texteBrutSiLectureSeule: true,
        })
        groupe.ajoute(input);
        console.log(info(input));

        const grInput = new KfGroupe('inputGroup');
        grInput.ajouteClasse('mb-3');
        étiquette = new KfEtiquette('icone1')
        étiquette.fixeIcone(Fabrique.icone.def.filtre);
        grInput.ajoute(étiquette);
        grInput.ajoute(créeInput(nom + '1'));
        KfBootstrap.prépare(grInput, {
//            label: 'nePasAfficherLabel',
            taille: 'sm',
            dansInputGroup: true
        });
        groupe.ajoute(grInput);

        const grInput1 = new KfGroupe('inputGroup');
        grInput1.ajouteClasse('mb-3');
        const bouton = new KfEtiquette('icone2')
        bouton.fixeIcone(Fabrique.icone.def.copier);
        grInput1.ajoute(bouton);
        grInput1.ajoute(créeInput(nom + '2'));
        KfBootstrap.prépare(grInput, {
//            label: 'nePasAfficherLabel',
            taille: 'sm',
            dansInputGroup: true
        });
        groupe.ajoute(grInput1);

        return groupe;
    }


    private créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.estRacineV = true;
        this.superGroupe.avecInvalidFeedback = true;

        this.superGroupe.ajoute(this.créeEdition());

        const dateTemps = new KfInputDateTemps('dateTemps', 'dateTemps');
        const d0 = new Date();
        const d1 = Dateur.ajouteHeures(d0, 1);
        dateTemps.valeur = d1;
        dateTemps.ajouteValidateur(KfValidateurs.validateurDeFn('maintenant_plus',
            (value: Date) => {
                const maintenant = new Date();
                return value.valueOf() <= maintenant.valueOf();
            },
            'La moment choisi est déjà passé.'));
        this.superGroupe.ajoute(dateTemps);

        this.superGroupe.comportementFormulaire = { sauveQuandChange: true };
        this.superGroupe.quandTousAjoutés();
    }

}
