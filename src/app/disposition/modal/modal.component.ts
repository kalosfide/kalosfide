
import { PageBaseComponent } from '../page-base/page-base.component';
import { Data, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { OnInit, OnDestroy } from '@angular/core';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { IKfNgbModalDef, KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { IBoutonDef } from '../fabrique/fabrique-bouton';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Fabrique } from '../fabrique/fabrique';
import { IUrlDef } from '../fabrique/fabrique-url';

export interface IModalComponentDef {
    titre: string;
    corps: KfGroupe;
    /**
     * Les noms doivent être différents entre eux et différent de ngbModalCroix.
     * Les actions doivent se conclure par une redirection.
     */
    boutonDefs: IBoutonDef[];
    options?: NgbModalOptions;
    urlSiPasAction: IUrlDef;
}

export abstract class ModalComponent extends PageBaseComponent implements OnInit, OnDestroy {


    abstract créeDef(data: Data): IModalComponentDef;

    constructor(
        protected route: ActivatedRoute,
        protected service: DataService
    ) {
        super();
    }

    get iservice(): DataService {
        return this.service;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.route.data.subscribe((data: Data) => {
                const modalComponentDef = this.créeDef(data);
                const modalDef: IKfNgbModalDef = {
                    titre: modalComponentDef.titre,
                    corps: modalComponentDef.corps,
                    boutonsDontOk: [],
                    options: modalComponentDef.options
                };
                const actionDefs: { nom: string, action: () => void }[] = [];
                modalComponentDef.boutonDefs.forEach(def => {
                    const action = { nom: def.nom, action: def.action };
                    actionDefs.push(action);
                    const bouton = Fabrique.bouton.bouton({ nom: def.nom, contenu: def.contenu, bootstrapType: def.bootstrapType });
                    modalDef.boutonsDontOk.push(bouton);
                });
                const modal = new KfNgbModal(modalDef);
                modal.avecFond = 'static';
                modal.ferméSiEchap = true;
                modal.windowClass = 'modal-component';
                this.iservice.modalService.résultat(modal).subscribe((résultat) => {
                    let action: () => void;
                    if (typeof (résultat) === 'string') {
                        const actionDef = actionDefs.find(a => a.nom === résultat);
                        if (actionDef) {
                            action = actionDef.action;
                        }
                    }
                    if (!action) {
                        action = () => this.iservice.routeur.navigueUrlDef(modalComponentDef.urlSiPasAction);
                    }
                    action();
                });
            })
        );
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

}
