import { Component, OnInit } from '@angular/core';
import { FormulaireComponent } from '../disposition/formulaire/formulaire.component';
import { PeupleService } from './peuple.service';
import { AppSitePages } from './app-site-pages';
import { PageDef } from '../commun/page-def';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { Observable } from 'rxjs';
import { ApiResult } from '../api/api-results/api-result';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfCaseACocher } from '../commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { ActivatedRoute } from '@angular/router';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { KfNgbModalService } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal.service';
import { IKfNgbModalDef, KfNgbModal } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { IKfBootstrapOptions, KfBootstrap } from '../commun/kf-composants/kf-partages/kf-bootstrap';
import { ApiResult500InternalServerError } from '../api/api-results/api-result-500-internal-server-error';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSitePeupleComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = AppSitePages.peuple;

    private sansPeuple: KfCaseACocher;

    get optionsBootstrap(): IKfBootstrapOptions {
        return null;
    }

    créeAvantFormulaire = (): KfComposant[] => {
        const valeur = new KfEtiquette('valeur', () => JSON.stringify(this.valeur, null, 2));
        valeur.baliseHtml = KfTypeDeBaliseHTML.pre;
        return [valeur];
    }

    créeEdition = (): KfGroupe => {
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

        this.sansPeuple = Fabrique.caseACocher('sansPeuple');
        this.sansPeuple.visible = true;
//        Fabrique.caseACocherAspect(this.sansPeuple, true);
        this.sansPeuple.ajouteValidateur(KfValidateurs.requiredTrue);
        groupe.ajoute(this.sansPeuple);
        groupe.ajoute(this.créeTest());
        return groupe;
    }

    créeTest(): KfGroupe {
        const messages = new KfGroupe('');
        let etiquette: KfEtiquette;
        etiquette = new KfEtiquette('', 'message1');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        messages.ajoute(etiquette);
        etiquette = new KfEtiquette('', 'message1');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        messages.ajoute(etiquette);
        const boutonOk = Fabrique.bouton.bouton({
            nom: 'Ok',
            contenu: { texte: 'Ok' },
            bootstrap: { type: 'primary' }
        });
        const boutonAnnuler = Fabrique.bouton.bouton({
            nom: 'Annuler',
            contenu: { texte: 'Annuler' },
            bootstrap: { type: 'secondary' }
        });
        const test = new KfGroupe('');
        test.ajoute(Fabrique.bouton.bouton({
            nom: 'copie',
            contenu: Fabrique.contenu.copier(),
            action: () => {
                const def: IKfNgbModalDef = {
                    titre: 'Test',
                    corps: messages,
                    boutonsDontOk: [boutonAnnuler, boutonOk],
                    boutonOk
                };
                const modal = new KfNgbModal(def);
                modal.enTete.ajouteClasse(KfBootstrap.classe('alert', 'danger'));
                this.modalService.confirme(Fabrique.erreurModal(new ApiResult500InternalServerError()));
            }
        }));
        etiquette = new KfEtiquette('', '0');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.span;
        test.ajoute(etiquette);
        test.ajoute(Fabrique.bouton.bouton({ nom: 'annule', contenu: Fabrique.contenu.annule() }));
        return test;
    }

    créeBoutonsDeFormulaire = (formulaire: KfGroupe): KfBouton[] => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Peupler la BDD');
        return [this.boutonSoumettre];
    }
    actionSiOk = (): void => {
        this.sansPeuple.valeur = false;
    }
    apiDemande = (): Observable<ApiResult> => {
        return this.service.peuple();
    }

    constructor(
        private route: ActivatedRoute,
        protected service: PeupleService,
        private modalService: KfNgbModalService,
    ) {
        super(service);
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this.superGroupe = Fabrique.formulaire.superGroupe(this);
                this.formulaire.comportementFormulaire.neSoumetPasSiPristine = undefined;
                this.sansPeuple.valeur = !data.estPeuplé;
            }
        ));
    }

}
