import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';


import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { DataKeyService } from './data-key.service';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { DataTexteSoumettre } from './data-pages';
import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { IDataKey } from './data-key';
import { ApiAction } from '../../api/api-route';
import { Site } from 'src/app/modeles/site/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfStringDef } from '../kf-composants/kf-partages/kf-string-def';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { Component, OnInit } from '@angular/core';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { KfBouton } from '../kf-composants/kf-elements/kf-bouton/kf-bouton';
import { IBarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';
import { DataKeyEditeur } from './data-key editeur';
import { IDataComponent } from './i-data-component';

export class ActionAles {
    nom: string;
    texteSoumettre: string;
    apiDemande: () => Observable<ApiResult>;
    actionSiOk?: (créé?: any) => void;
}

@Component({ template: '' })
export abstract class DataKeyALESComponent<T extends IDataKey> extends FormulaireComponent implements OnInit, IDataComponent {

    abstract site: Site;
    get urlSiteDef(): KfStringDef {
        return () => this.site.url;
    }

    action: ActionAles;

    créeBoutonsDeFormulaire: (formulaire: KfSuperGroupe) => (KfLien | KfBouton)[];

    fixeGroupeBoutonsMessages: () => void;

    protected chargeData: (data: Data) => void;
    protected contenuAidePage: () => KfComposant[];

    private lienIndex: KfLien;

    dataEditeur: DataKeyEditeur<T>;
    abstract créeDataEditeur(): void;

    abstract get keyDeAjoute(): IDataKey;
    abstract fixeKeyDeAjoute(ajouté: T): void;

    constructor(
        protected route: ActivatedRoute,
        protected service: DataKeyService<T>,
    ) {
        super(service);
    }

    créeBarreTitre = (): IBarreTitre => {
        const def: IBarreDef = {
            pageDef: this.pageDef,
        };
        if (this.lienIndex) {
            const groupe = Fabrique.titrePage.groupeRetour(this.lienIndex);
            def.groupesDeBoutons = [groupe];
        }
        if (this.contenuAidePage) {
            def.contenuAidePage = this.contenuAidePage();
        }
        const barre = Fabrique.titrePage.barreTitre(def);
        return barre;
    }

    actionAjoute(): ActionAles {
        return {
            // this.valeur contient la clé (incomplète si numAuto) et tous les autres champs
            nom: ApiAction.data.ajoute,
            texteSoumettre: DataTexteSoumettre(ApiAction.data.ajoute),
            apiDemande: () => this.service.ajoute(this.valeur)
        };
    }

    actionEdite(): ActionAles {
        return {
            // this.valeur contient la clé et les champs modifiables
            nom: ApiAction.data.edite,
            texteSoumettre: DataTexteSoumettre(ApiAction.data.edite),
            apiDemande: () => this.service.edite(this.valeur)
        };
    }

    actionSupprime(): ActionAles {
        return {
            // this.valeur ne contient que la clé IMPORTANT
            nom: ApiAction.data.supprime,
            texteSoumettre: DataTexteSoumettre(ApiAction.data.supprime),
            apiDemande: () => this.service.supprime(this.valeur)
        };
    }

    créeEdition = (): KfGroupe => {
        this.créeDataEditeur();
        this.dataEditeur.créeFormulaire();
        return this.dataEditeur.edition;
    }

    get avecValeur(): boolean {
        return true;
    }

    ngOnInit() {
        this.site = this.service.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                if (this.service.utile.lienKey) {
                    if (this.action.nom === ApiAction.data.ajoute) {
                        this.lienIndex = this.service.utile.lienKey.index();
                        this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
                            this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, this.action.texteSoumettre);
                            return [
                                Fabrique.lien.boutonAnnuler(this.service.utile.urlKey.index()),
                                this.boutonSoumettre
                            ];
                        };
                    } else {
                        this.lienIndex = this.service.utile.lienKey.retourIndex(data.valeur);
                        this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
                            this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, this.action.texteSoumettre);
                            return [
                                Fabrique.lien.boutonAnnuler(this.service.utile.urlKey.retourIndex(data.valeur)),
                                this.boutonSoumettre
                            ];
                        };
                    }
                } else {
                    this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
                        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, this.action.texteSoumettre);
                        return [
                            this.boutonSoumettre
                        ];
                    };
                }
                this.superGroupe = Fabrique.formulaire.superGroupe(this);
                if (this.chargeData) {
                    this.chargeData(data);
                }
                this.créeTitrePage();
                if (this.action.nom === ApiAction.data.ajoute) {
                    this.dataEditeur.fixeKfKey(this.keyDeAjoute);
                } else {
                    this.dataEditeur.fixeKfKey(data.valeur);
                    this.fixeValeur(data.valeur);
                }
                if (this.fixeGroupeBoutonsMessages) {
                    this.fixeGroupeBoutonsMessages();
                }
            }
        ));
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.action.apiDemande();
    }

    actionSiOk = (créé?: T): void => {
        if (this.action.nom === ApiAction.data.ajoute) {
            this.fixeKeyDeAjoute(créé);
        }
        if (this.action.actionSiOk) {
            this.action.actionSiOk(this.valeur);
        }
        this.routeur.navigueUrlDef(this.service.utile.urlKey.retourIndex(this.valeur));
    }

    get valeur(): T {
        if (this.dataEditeur && this.dataEditeur.valeur) {
            return this.dataEditeur.valeur;
        }
    }

    fixeValeur(valeur: T) {
        this.dataEditeur.fixeValeur(valeur);
    }
}
