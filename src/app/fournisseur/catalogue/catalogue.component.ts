import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { BootstrapType } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';

interface IActionDef {
    infos: KfComposant[];
    alerte: BootstrapType;
    inactif: boolean;
    titre: string;
    action: () => void;
}

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CatalogueComponent extends PageBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.catalogue;

    site: Site;
    barre: BarreTitre;

    actionDef: IActionDef;

    constructor(
        protected route: ActivatedRoute,
        protected service: CatalogueService,
    ) {
        super();
    }

    titreAction = 'Modification';
    titreCommencer = 'Commencer';
    titreTerminer = 'Arrêter';

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        const info = Fabrique.titrePage.boutonInfo('', 'Etat');
        const action = Fabrique.titrePage.boutonAction('action');
        const groupe = Fabrique.titrePage.bbtnGroup('action');
        groupe.ajoute(info);
        groupe.ajoute(action);

        const rafraichit = () => {
            const couleur = this.actionDef.alerte === 'danger'
                ? Couleur.red
                : this.actionDef.alerte === 'warning'
                    ? Couleur.warning
                    : Couleur.green;
            Fabrique.contenu.fixeDef(info, {
                nomIcone: Fabrique.icone.nomIcone.info,
                couleurIcone: couleur,
                texte: this.titreAction,
            });
            Fabrique.titrePage.fixePopover(info, this.actionDef.titre, this.actionDef.infos);
            Fabrique.contenu.fixeDef(action, { texte: this.actionDef.titre });
            Fabrique.bouton.fixeActionBouton(action, this.actionDef.action);
            action.inactivité = this.actionDef.inactif;
        };

        barre.ajoute({ groupe, rafraichit });

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

    get apiRequêteCommencer(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.commenceModification(this.site);
            },
            actionSiOk: (): void => {
                this.service.commenceModificationOk(this.site);
                this.service.routeur.naviguePageDef(FournisseurPages.catalogue, FournisseurRoutes, this.site.nomSite);
            },
        };
        return apiRequêteAction;
    }

    get apiRequêteTerminer(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.termineModification(this.site);
            },
            actionSiOk: (): void => {
                this.service.termineModificationOk(this.site);
                this.service.routeur.naviguePageDef(FournisseurPages.catalogue, FournisseurRoutes, this.site.nomSite);
            },
        };
        return apiRequêteAction;
    }

    créeActionDef(): IActionDef {
        const infos: KfComposant[] = [];
        let alerte: BootstrapType;
        let inactif = false;
        let titre: string;
        let apiRequête: ApiRequêteAction;

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
                    etiquette.ajouteClasseDef('alert-warning');
                    Fabrique.ajouteTexte(etiquette, `Attention! un client connecté ne peut pas commander pendant le traitement.`);
                }
                titre = this.titreTerminer;
                apiRequête = this.apiRequêteTerminer;
                break;
            case IdEtatSite.ouvert:
                titre = this.titreCommencer;
                apiRequête = this.apiRequêteCommencer;
                break;
        }

        const def: IActionDef = {
            infos,
            alerte,
            inactif,
            action: () => {
                const subscription = this.service.actionOkObs(apiRequête).subscribe(() => {
                    subscription.unsubscribe();
                });
                    },
            titre
        };

        return def;
    }

    private rafraichit() {
        this.actionDef = this.créeActionDef();
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
