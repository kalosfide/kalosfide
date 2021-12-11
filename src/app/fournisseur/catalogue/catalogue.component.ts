import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { FournisseurPages } from '../fournisseur-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { BootstrapType, KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CatalogueComponent extends PageBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.catalogue;

    site: Site;

    titreCommencer = 'Modification';
    titreTerminer = 'Consultation';

    private apiRequêteCommencer: ApiRequêteAction;
    private apiRequêteTerminer: ApiRequêteAction;

    constructor(
        protected route: ActivatedRoute,
        protected service: CatalogueService,
    ) {
        super();
    }

    créeBarreTitre = (): IBarreTitre => {
        const créeBouton = (
            nom: string,
            texte: string,
            apiRequêteAction: ApiRequêteAction,
            active: () => boolean,
            titreModal: string,
            typeModal: BootstrapType,
            contenusModal: KfComposant[]
        ) => {
            const boutonDef = Fabrique.titrePage.boutonDef(nom, { texte });
            boutonDef.action = {
                active,
                apiAction: apiRequêteAction,
                modalAprès: Fabrique.infoModal(titreModal, contenusModal, typeModal),
            };
            const bouton = Fabrique.titrePage.boutonBascule(boutonDef, active, this.service);
            return bouton;
        }
        const groupe = Fabrique.titrePage.bbtnGroup('action');
        let contenusModal: KfComposant[];
        let étiquette: KfEtiquette;
        contenusModal = [];
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        étiquette.ajouteTextes(
            `Votre site est ouvert.`,
        );
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        étiquette.ajouteTextes(
            `Vos clients ont plein accès à votre site.`,
        );
        groupe.ajoute(créeBouton('consulter',
            this.titreTerminer,
            this.service.termineModification(this.site),
            (() => this.site.ouvert).bind(this),
            'Fin de la modification du catalogue',
            'success',
            contenusModal
        ));
        contenusModal = [];
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        étiquette.ajouteTextes(
            { texte: `Votre site est fermé: l'accés de vos clients est limité.`, suiviDeSaut: true },
            `Vos clients ne peuvent ni consulter le catalogue ni commander pendant que le catalogue est en cours de modification.`,
        );
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        étiquette.ajouteTextes(
            { texte: `N'oubliez pas d'arrêter la modification en cliquant sur`, classe: KfBootstrap.classeTexte({ color: 'danger' }) },
            { texte: 'Consultation', classe: KfBootstrap.classeTexte({ color: 'danger', poids: 'bold' }) },
            { texte: `quand vous aurez terminé de mettre à jour le catalogue.`, classe: KfBootstrap.classeTexte({ color: 'danger' }) }
        )
        étiquette = Fabrique.ajouteEtiquetteP(contenusModal);
        const icone = Fabrique.icone.iconeVerrouFermé();
        icone.créeFond();
        icone.fond.ajouteClasse(KfBootstrap.classeBouton({ type: 'danger', taille: 'sm' }));
        étiquette.ajouteContenus(
            `Le bouton`,
            icone,
            `est présent sur toutes les pages pour vous le rappeler.`
        )
        groupe.ajoute(créeBouton('modifier',
            this.titreCommencer,
            this.service.commenceModification(this.site),
            (() => !this.site.ouvert).bind(this),
            'Modification du catalogue',
            'danger',
            contenusModal
        ));
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            groupesDeBoutons: [groupe, Fabrique.titrePage.groupeDefAccès(null, 'invisible')]
        });
        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Utilisez le bouton`,
            { texte: this.titreCommencer, balise: KfTypeDeBaliseHTML.b },
            `pour commencer la modification du catalogue.`,
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Pendant la modification du catalogue, vous pouvez créer et modifier les produits et leurs catégories et fixer les prix`,
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Pendant la modification du catalogue, vos clients tentant d'accéder aux pages `,
            { texte: 'Catalogue', balise: KfTypeDeBaliseHTML.i },
            ` et `,
            { texte: 'Commandes', balise: KfTypeDeBaliseHTML.i },
            'seront redirigés vers une page ',
            { texte: 'Site fermé', balise: KfTypeDeBaliseHTML.i },
            `.`
        );
        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `La modification du catalogue s'arrête quand vous pressez le bouton`,
            { texte: this.titreTerminer, balise: KfTypeDeBaliseHTML.b },
            `ou quand vous quittez les pages du catalogue.`
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

        if (this.site.ouvert) {
            titre = this.titreCommencer;
            apiAction = this.apiRequêteCommencer;
        } else {
            if (this.site.bilan.catalogue.produits === 0) {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(
                    `Vous ne pouvez pas `,
                    { texte: 'Terminer la modification', balise: KfTypeDeBaliseHTML.b },
                    ` et rouvrir votre site tant qu'il n'y a pas de produits disponibles.`
                );
                alerte = 'danger';
                inactif = true;
            } else {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteClasse('alert-warning');
                etiquette.ajouteTextes(`Attention! un client connecté ne peut pas commander pendant le traitement.`);
            }
            titre = this.titreTerminer;
            apiAction = this.apiRequêteTerminer;
        }
        this.barre.site = this.site;
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.niveauTitre = 0;
        this.site = this.service.identification.siteEnCours;
        this.créeTitrePage();
        this.rafraichit();

        this.subscriptions.push(this.service.identification.souscritASiteChange(((site: Site) => {
            this.site = site;
            this.rafraichit();
        }).bind(this)));
    }

}
