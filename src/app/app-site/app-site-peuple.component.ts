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
import { KfBootstrap } from '../commun/kf-composants/kf-partages/kf-bootstrap';
import { ApiResult500InternalServerError } from '../api/api-results/api-result-500-internal-server-error';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSitePeupleComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = AppSitePages.peuple;

    private sansPeuple: KfCaseACocher;

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        this.sansPeuple = Fabrique.caseACocher('sansPeuple');
        this.sansPeuple.visible = true;
        Fabrique.caseACocherAspect(this.sansPeuple, true);
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
            bootstrapType: 'primary'
        });
        const boutonAnnuler = Fabrique.bouton.bouton({
            nom: 'Annuler',
            contenu: { texte: 'Annuler' },
            bootstrapType: 'secondary'
        });
        const test = new KfGroupe('');
        test.ajoute(Fabrique.bouton.bouton({
            nom: 'copie',
            contenu: Fabrique.contenu.copier,
            action: () => {
                const def: IKfNgbModalDef = {
                    titre: 'Test',
                    corps: messages,
                    boutonsDontOk: [boutonAnnuler, boutonOk],
                    boutonOk
                };
                const modal = new KfNgbModal(def);
                modal.ajouteClasseEnTête(KfBootstrap.classe('alert', 'danger'));
                this.modalService.confirme(Fabrique.erreurModal(new ApiResult500InternalServerError()));
            }
        }));
        etiquette = new KfEtiquette('', '0');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.span;
        test.ajoute(etiquette);
        test.ajoute(Fabrique.bouton.bouton({ nom: 'annule', contenu: Fabrique.contenu.annule }));
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
                this.sansPeuple.valeur = !data.estPeuplé;
            }
        ));
    }

}
