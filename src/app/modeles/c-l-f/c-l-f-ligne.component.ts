import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Site } from '../site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { Observable } from 'rxjs';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Produit } from '../catalogue/produit';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Client } from '../client/client';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { RouteurService } from 'src/app/services/routeur.service';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { CLFLigne } from './c-l-f-ligne';
import { CLFUtile } from './c-l-f-utile';
import { CLFService } from './c-l-f.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ValeurStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { DataService } from 'src/app/services/data.service';
import { CLFDoc } from './c-l-f-doc';

@Component({ template: '' })
export abstract class CLFLigneAjouteComponent extends PageBaseComponent implements OnInit, OnDestroy, IDataComponent {

    site: Site;
    identifiant: Identifiant;

    private pLigne: CLFLigne;

    private afficheRésultat: AfficheResultat;

    get utile(): CLFUtile {
        return this.service.utile;
    }

    get ligne(): CLFLigne { return this.pLigne; }
    get produit(): Produit { return this.pLigne.produit; }
    get client(): Client { return this.pLigne.client; }

    get clfDoc(): CLFDoc {
        return this.ligne.parent;
    }

    get titre(): string {
        return !this.clfDoc.synthèse
            ? this.pageDef.titre
            : `${this.service.utile.texte.textes(this.clfDoc.synthèse.type).def.Bon}${this.clfDoc.no !== 0
                ? ' n° ' + this.clfDoc.no
                : ' virtuel'}${this.pageDef.titre ? ' - ' + this.pageDef.titre : ''}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super();
    }

    get iservice(): DataService {
        return this.service;
    }

    get routeur(): RouteurService { return this.service.routeur; }

    protected contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    créeBarreTitre = (): IBarreTitre => {
        const groupe = Fabrique.titrePage.groupeRetour(this.utile.lien.retourDeAjoute(this.ligne));
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            groupesDeBoutons: [groupe]
        });
        return barre;
    }

    peutQuitter = (nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> => {
        if (nextState) {
            let permise = ValeurStringDef(Fabrique.url.url(this.utile.url.bon()));
            if (nextState.url === permise) {
                return true;
            }
            permise = ValeurStringDef(Fabrique.url.url(this.utile.url.ajoute(this.ligne)));
            if (nextState.url.substr(0, permise.length) === permise) {
                return true;
            }
        }
        return this.peutQuitterService.confirme(this.pageDef.titre);
    }

    private créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);

        this.pLigne.créeEditeur(this);
        this.pLigne.éditeur.créeFormulaire();
        const formulaire = this.pLigne.éditeur.edition;
        formulaire.comportementFormulaire = {
            sauveQuandChange: true,
            neSoumetPasSiPristine: true,
            traiteSubmit: { traitement: () => {
                const apiRequêteAction = this.service.apiRequêteAjouteLigne(this.pLigne, this.superGroupe, this.afficheRésultat);
                const subscription = this.service.actionObs(apiRequêteAction).subscribe(() => {
                    subscription.unsubscribe();
                })
            }}
        };
        formulaire.avecInvalidFeedback = true;
        this.superGroupe.ajoute(formulaire);

        this.afficheRésultat = Fabrique.formulaire.ajouteResultat(formulaire);

        const boutonAnnuler = Fabrique.lien.boutonAnnuler(this.utile.url.retourLigne(this.pLigne));
        const boutonAjoute = Fabrique.bouton.soumettre(formulaire, 'Ajouter');
        const btnsMsgs = new GroupeBoutonsMessages('ajoute', { boutons: [boutonAnnuler, boutonAjoute] });
        this.superGroupe.ajoute(btnsMsgs.groupe);
        this.superGroupe.ajoute(this.afficheRésultat.groupe);

        this.superGroupe.quandTousAjoutés();
    }

    protected initialiseUtile() {
        this.service.utile.url.fixeRouteDoc(this.ligne.parent);
    }

    ngOnInit() {
        this.site = this.service.navigation.litSiteEnCours();
        this.identifiant = this.service.identification.litIdentifiant();

        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this.pLigne = data.clfLigne;
                this.initialiseUtile();
                this.créeTitrePage();
                this.créeSuperGroupe();
            }
        ));
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }
}
