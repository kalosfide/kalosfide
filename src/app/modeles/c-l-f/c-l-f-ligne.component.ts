import { OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Data, RouterStateSnapshot } from '@angular/router';
import { Site } from '../site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Produit } from '../catalogue/produit';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Client } from '../client/client';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { RouteurService } from 'src/app/services/routeur.service';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { FabriqueBootstrap, BootstrapType } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { DATE_EST_NULLE } from '../date-nulle';
import { CLFLigne } from './c-l-f-ligne';
import { CLFUtile } from './c-l-f-utile';
import { CLFService } from './c-l-f.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { BarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ValeurTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';
import { DataService } from 'src/app/services/data.service';
import { CLFDoc } from './c-l-f-doc';

export abstract class CLFLigneComponent extends PageBaseComponent implements OnInit, OnDestroy, AfterViewInit, IDataKeyComponent {

    site: Site;
    identifiant: Identifiant;

    private pLigne: CLFLigne;

    private afficheRésultat: AfficheResultat;

    /** si présent et vrai, c'est la page ./supprime */
    suppression?: boolean;
    ajout: boolean;

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
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    créeBarreTitre = (): BarreTitre => {
        const def: IBarreDef = {
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        };
        if (this.ajout) {
            def.boutonsPourBtnGroup = [[this.utile.lien.retourDeAjoute(this.ligne)]];
        }
        const barre = Fabrique.titrePage.barreTitre(def);
        return barre;
    }

    peutQuitter = (nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> => {
        if (nextState) {
            let permise = ValeurTexteDef(Fabrique.url.url(this.utile.url.bon()));
            if (nextState.url === permise) {
                return true;
            }
            permise = ValeurTexteDef(Fabrique.url.url(this.utile.url.ajoute(this.ligne)));
            if (nextState.url.substr(0, permise.length) === permise) {
                return true;
            }
        }
        return this.peutQuitterService.confirme(this.pageDef.titre);
    }

    private apiRequêteActionEdite(afficheResultat: AfficheResultat): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.editeLigne(this.pLigne, this.ajout);
            },
            actionSiOk: (): void => {
                this.service.siEditeLigneOk(this.pLigne);
                this.routeur.navigueUrlDef(this.utile.lien.url.bon());
            },
            afficheResultat,
            traiteErreur: this.service.traiteErreur
        };
        return apiRequêteAction;
    }

    private créeGroupeSupprime(afficheResultat: AfficheResultat): KfGroupe {

        let peutSupprimer: boolean;
        let texteDemande: string;
        let bootstrapType: BootstrapType;
        let textes: string[];
        let texte: string;
        let demandeApi: () => Observable<ApiResult>;
        let actionSiOk: (créé?: any) => void;
        if (!this.ligne.parent.synthèse) {
            // l'utilisateur est le client
            peutSupprimer = this.pLigne.date === undefined;
            texteDemande = this.produit.nom;
        } else {
            // l'utilisateur est le fournisseur
            peutSupprimer = DATE_EST_NULLE(this.pLigne.date);
            texteDemande = this.produit.nom + ' par ' + this.client.nom;
        }

        if (peutSupprimer) {
            bootstrapType = 'danger';
            textes = [
                `La demande de ${texteDemande} va être supprimée.`,
                'Cette action ne pourra pas être annulée.'
            ];
            texte = 'Supprimer';
            demandeApi = () => this.service.supprimeLigne(this.ligne);
            actionSiOk = () => this.service.siSupprimeLigneOk(this.ligne);
        } else {
            bootstrapType = 'warning';
            textes = [
                `La demande de ${texteDemande} va être refusée et exclue de la livraison.`,
                'Vous pourrez annuler cette action en fixant à nouveau la quantité à livrer.'
            ];
            texte = 'Refuser';
            demandeApi = () => {
                this.ligne.aFixer = 0;
                return this.service.editeLigne(this.ligne);
            };
            actionSiOk = () => this.service.siEditeLigneOk(this.ligne);
        }
        const groupe = new KfGroupe('');
        FabriqueBootstrap.ajouteClasse(groupe, 'alert', bootstrapType);
        const etiquettes: KfComposant[] = [];
        Fabrique.ajouteEtiquetteP(etiquettes, 'text-center');
        Fabrique.ajouteEtiquetteP(etiquettes, 'text-center');
        etiquettes.forEach(e => groupe.ajoute(e));

        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi,
            actionSiOk: (): void => {
                actionSiOk();
                this.routeur.navigueUrlDef(this.utile.lien.url.bon());
            },
            afficheResultat,
            traiteErreur: this.service.traiteErreur
        };
        const boutonAnnuler = Fabrique.lien.boutonAnnuler(this.utile.url.retourLigne(this.pLigne));
        const btSupprime = Fabrique.bouton.boutonAction('supprime', 'Supprimer', apiRequêteAction, this.service);
        const btnsMsgs = new GroupeBoutonsMessages('supprimme');
        btnsMsgs.créeBoutons([boutonAnnuler, btSupprime]);
        groupe.ajoute(btnsMsgs.groupe);
        etiquettes[0].fixeTexte(`La demande de ${texteDemande} va être supprimée.`);
        etiquettes[1].fixeTexte('Cette action ne pourra pas être annulée.');
        btSupprime.fixeTexte('Supprimer');

        return groupe;
    }

    private créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;
        this.superGroupe.neSoumetPasSiPristine = true;
        this.superGroupe.avecInvalidFeedback = true;

        this.pLigne.créeEditeur(this);
        this.pLigne.éditeur.créeEdition(this.pageDef);
        const edition = this.pLigne.éditeur.edition;
        this.superGroupe.ajoute(edition);

        this.afficheRésultat = Fabrique.formulaire.ajouteResultat(edition);

        if (this.suppression) {
            this.superGroupe.ajoute(this.créeGroupeSupprime(this.afficheRésultat));
        } else {
            const apiRequêteAction = this.apiRequêteActionEdite(this.afficheRésultat);
            const boutonAnnuler = Fabrique.lien.boutonAnnuler(this.utile.url.retourLigne(this.pLigne));
            const boutonEdite = Fabrique.bouton.boutonAction('edite',
                this.ajout ? 'Ajouter' : 'Mettre à jour', apiRequêteAction, this.service);
            boutonEdite.inactivitéFnc = () => {
                return !this.superGroupe.peutSoumettre();
            };
            const btnsMsgs = new GroupeBoutonsMessages('edite');
            btnsMsgs.créeBoutons([boutonAnnuler, boutonEdite]);
            this.superGroupe.ajoute(btnsMsgs.groupe);
            this.superGroupe.ajoute(this.afficheRésultat.groupe);

        }
        this.superGroupe.avecInvalidFeedback = true;
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

    ngAfterViewInit() {
        this.subscriptions.push(this.afficheRésultat.souscritStatut());
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }
}
