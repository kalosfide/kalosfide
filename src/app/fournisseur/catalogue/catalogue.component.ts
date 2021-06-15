import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { BootstrapType, KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfEvenement, KfStatutDEvenement, KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { concatMap } from 'rxjs/operators';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CatalogueComponent extends PageBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.catalogue;

    site: Site;

    titreAction = 'Modification';
    titreCommencer = 'Commencer';
    titreTerminer = 'Arrêter';

    private apiRequêteCommencer: ApiRequêteAction;
    private apiRequêteTerminer: ApiRequêteAction;

    constructor(
        protected route: ActivatedRoute,
        protected service: CatalogueService,
    ) {
        super();
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        const créeBouton = (
            nom: string,
            texte: string,
            demandeApi: () => Observable<ApiResult>,
            actionSiOk: () => void,
            active: () => boolean,
            titreModal: string,
            contenusModal: KfComposant[]
        ) => {
            const apiRequêteAction: ApiRequêteAction = {
                demandeApi,
                actionSiOk,
            }
            const bouton = Fabrique.bouton.bouton({
                nom,
                contenu: {
                    texte
                },
                action: () => {
                    if (active()) {
                        return;
                    }
                    const modal = Fabrique.infoModal(titreModal, contenusModal);
                    const subscription = this.service.actionObs(apiRequêteAction).pipe(
                        concatMap((ok: boolean) => this.service.modalService.confirme(modal))
                    ).subscribe(
                        () => {
                            subscription.unsubscribe();
                        }
                    );
                }
            });
            KfBootstrap.ajouteClasse(bouton, 'btn', 'primary');
            bouton.ajouteClasse({ nom: 'active', active });
            return bouton;
        }
        const groupe = Fabrique.titrePage.bbtnGroup('action');
        let contenusModal: KfComposant[];
        let étiquette: KfEtiquette;
        contenusModal = [];
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        Fabrique.ajouteTexte(étiquette,
            `Vos clients ont plein accès à votre site.`,
        );
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        Fabrique.ajouteTexte(étiquette,
            `Vos clients ont plein accès à votre site.`,
        );
        groupe.ajoute(créeBouton('consulter', 'Consultation',
            () => {
                return this.service.termineModification(this.site);
            },
            () => {
                this.service.termineModificationOk(this.site);
            },
            (() => this.site.etat !== IdEtatSite.catalogue).bind(this),
            'Fin de la modification du catalogue',
            contenusModal
        ));
        contenusModal = [];
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        Fabrique.ajouteTexte(étiquette,
            `Vos clients ont plein accès à votre site.`,
        );
        groupe.ajoute(créeBouton('modifier', 'Modification',
            () => {
                return this.service.commenceModification(this.site);
            },
            () => {
                this.service.commenceModificationOk(this.site);
            },
            (() => this.site.etat === IdEtatSite.catalogue).bind(this),
            'Modification du catalogue',
            contenusModal
        ));
        barre.ajoute({ groupe: groupe });

        barre.ajoute(Fabrique.titrePage.groupeDefAccès());

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Pour pouvoir créer et modifier les produits et leurs catégories et fixer les prix, vous devez `,
            { texte: this.titreCommencer, balise: KfTypeDeBaliseHTML.b },
            `.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Pendant la modification du catalogue, votre site sera fermé: les accès aux pages `,
            { texte: 'Catalogue', balise: KfTypeDeBaliseHTML.i },
            ` et `,
            { texte: 'Commandes', balise: KfTypeDeBaliseHTML.i },
            ' redirigeront vos visiteurs et vos clients vers une page ',
            { texte: 'Site fermé', balise: KfTypeDeBaliseHTML.i },
            `.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Vous devrez `,
            { texte: 'Terminer la modification', balise: KfTypeDeBaliseHTML.b },
            ` pour rouvrir votre site.`
        );

        return infos;
    }

    private rafraichit() {
        const infos: KfComposant[] = [];
        let alerte: BootstrapType;
        let inactif = false;
        let titre: string;
        let apiAction: ApiRequêteAction;

        let etiquette: KfEtiquette;

        switch (this.site.etat) {
            case IdEtatSite.catalogue:
                if (this.site.nbProduits === 0) {
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    Fabrique.ajouteTexte(etiquette,
                        `Vous ne pouvez pas `,
                        { texte: 'Terminer la modification', balise: KfTypeDeBaliseHTML.b },
                        ` et rouvrir votre site tant qu'il n'y a pas de produits disponibles.`
                    );
                    alerte = 'danger';
                    inactif = true;
                } else {
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    etiquette.ajouteClasse('alert-warning');
                    Fabrique.ajouteTexte(etiquette, `Attention! un client connecté ne peut pas commander pendant le traitement.`);
                }
                titre = this.titreTerminer;
                apiAction = this.apiRequêteTerminer;
                break;
            case IdEtatSite.ouvert:
                titre = this.titreCommencer;
                apiAction = this.apiRequêteCommencer;
                break;
        }
        this.barre.site = this.service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this.service.navigation.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.rafraichit();

        this.subscriptions.push(this.service.navigation.siteObs().subscribe(
            () => {
                this.site = this.service.navigation.litSiteEnCours();
                this.rafraichit();
            })
        );
    }

}
