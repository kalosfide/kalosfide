import { Component, OnInit } from '@angular/core';
import { FormulaireComponent } from '../disposition/formulaire/formulaire.component';
import { PeupleService } from './peuple.service';
import { AppSitePages } from './app-site-pages';
import { PageDef } from '../commun/page-def';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { Observable } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfCaseACocher } from '../commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { ActivatedRoute } from '@angular/router';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { KfNgbModalService } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal.service';
import { KfNgbModal } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styleUrls: ['../commun/commun.scss']
})
export class AppSiteIndexComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = AppSitePages.index;

    private sansPeuple: KfCaseACocher;

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.groupeEdition('peuple');
        this.sansPeuple = Fabrique.caseACocher('sansPeuple');
        this.sansPeuple.visible = false;
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
                this.modal.confirme(new KfNgbModal({
                    titre: 'Test',
                    corps: messages,
                    boutonsDontOk: [boutonAnnuler, boutonOk],
                    boutonOk
                }));
            }
        }));
        etiquette = new KfEtiquette('', '0');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.span;
        test.ajoute(etiquette);
        test.ajoute(Fabrique.bouton.bouton({ nom: 'annule', contenu: Fabrique.contenu.annule }));
        return test;
    }

    créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe): KfBouton[] => {
        return [Fabrique.bouton.boutonSoumettre(formulaire, 'Peupler la BDD')];
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
        private modal: KfNgbModalService,
    ) {
        super(service);
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this.formulaire = Fabrique.formulaire.formulaire(this);
                this.sansPeuple.valeur = !data.estPeuplé;
            }
        ));
    }

}
