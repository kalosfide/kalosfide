import { Component, OnInit } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { CommandePages } from './commande-pages';
import { ClientCLFService } from '../client-c-l-f.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { ActivatedRoute } from '@angular/router';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { ClientPages } from '../client-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommandeContexteComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = CommandePages.contexte;

    barre: BarreTitre;

    contexte: CLFDocs;

    étiquetteEtat: KfEtiquette;
    étiquetteAction: KfEtiquette;
    étiquetteAttention: KfEtiquette;

    constructor(
        private route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super();
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
        });

        this.barre = barre;
        return barre;
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        const groupe = new KfGroupe('actionImpossible');
        let etiquette: KfEtiquette;
        groupe.ajouteClasseDef('alert alert-warning');

        etiquette = new KfEtiquette('état');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        this.étiquetteEtat = etiquette;

        etiquette = new KfEtiquette('action');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        this.étiquetteAction = etiquette;

        etiquette = new KfEtiquette('attention');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        this.étiquetteAttention = etiquette;

        const lien = this.service.utile.lien.retourDeContexte();
        groupe.ajoute(lien);

        this.superGroupe.ajoute(groupe);
        this.superGroupe.quandTousAjoutés();
    }

    rafraichit(aEtéRedirigé?: boolean, préparationEnCours?: boolean) {
        const site = this.service.navigation.litSiteEnCours();
        this.barre.site = site;
        this.barre.rafraichit();
        Fabrique.ajouteTexte(this.étiquetteEtat,
            `${aEtéRedirigé ? 'Depuis votre dernière action, l' : 'L'}es commandes sur le site `,
            { texte: `${site.titre}`, balise: KfTypeDeBaliseHTML.i },
            ` ont été arrétées pour une modification du catalogue.`
        );
        this.étiquetteAction.fixeTexte(this.contexte.site.etat === IdEtatSite.catalogue
            ? 'Pour savoir si les commandes sont à nouveau ouvertes, essayez un lien vers la page du bon de commande. '
            + 'Il ne fonctionnera que quand la modification du catalogue sera terminée.'
            : 'La modification du catalogue est terminée et vous pouvez reprendre la préparation du bon de commande.'
        );
        if (préparationEnCours) {
            this.étiquetteAttention.fixeTexte(
                `Attention! Si le prix ou la disponibilité d'un produit demandé a changé, '
                + 'le bon de commande que vous prépariez a été modifié.`
            );
        } else {
            this.étiquetteAttention.nePasAfficher = true;
        }
    }

    ngOnInit() {
        this.créeTitrePage();
        this.créeSuperGroupe();

        this.subscriptions.push(
            this.route.data.subscribe(data => {
                this.contexte = data.contexte;
                const historique = this.service.navigation.historique();
                const précédent = historique[historique.length - 2];
                const segments = précédent.split('/');
                const index = segments.findIndex(s => s === ClientPages.commandes.urlSegment);
                let aEtéRedirigé: boolean;
                let préparationEnCours: boolean;
                if (index !== -1) {
                    aEtéRedirigé = true;
                    préparationEnCours = index + 1 < segments.length - 1 && segments[index + 1] === CommandePages.nouveau.urlSegment;
                }
                this.rafraichit(aEtéRedirigé, préparationEnCours);
            }),
        );
    }

}
