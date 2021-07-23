import { Subscription, Observable } from 'rxjs';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { Site } from '../site/site';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
import { ModeAction } from './condition-action';
import { ApiDocument } from './api-document';
import { CatalogueService } from '../catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiController, ApiAction } from 'src/app/api/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { ClientService } from '../client/client.service';
import { CLFDoc } from './c-l-f-doc';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { CLFLectureService } from './c-l-f-lecture.service';
import { CLFUtile } from './c-l-f-utile';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { CLFLigne } from './c-l-f-ligne';
import { ApiLigne } from './api-ligne';
import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { IdEtatSite } from '../etat-site';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { CLFDocs } from './c-l-f-docs';
import { TypeCLF } from './c-l-f-type';

/**
 * Implémentations: ClientCLFService, FournisseurCLFService
 */
export abstract class CLFService extends CLFLectureService {

    private pModeActionIO: ValeurEtObservable<ModeAction>;
    private pSubscriptionDeModeTableAModeAction: Subscription;

    constructor(
        nomStockage: string,
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(nomStockage, catalogueService, stockageService, clientService, apiRequeteService);
        this.créeUtile();
    }


    get transformeSiteFnc(): (site: Site) => ModeAction {
        return (site: Site) => {
            if (!site) {
                return ModeAction.aucun;
            }
            return site.etat === IdEtatSite.catalogue
                ? ModeAction.aperçu
                : ModeAction.edite;
        };
    }

    protected get transformeModeFnc(): (modeAction: ModeAction) => ModeTable {
        return (modeAction: ModeAction) => {
            switch (modeAction) {
                case ModeAction.aucun:
                    return ModeTable.sans;
                case ModeAction.edite:
                    return ModeTable.edite;
                case ModeAction.envoi:
                    return ModeTable.aperçu;
                default:
                    return ModeTable.aperçu;
            }
        };
    }

    private modeTableSouscritAModeAction() {
        this.pSubscriptionDeModeTableAModeAction = this.pModeActionIO.observable.subscribe(modeAction => {
            this.pModeTableIO.changeValeur(this.transformeModeFnc(modeAction));
        });
    }

    créeUtile() {
        const site = this.navigation.litSiteEnCours();
        this.pModeActionIO = ValeurEtObservable.nouveau<ModeAction>(this.transformeSiteFnc(site));
        this.pModeTableIO = ValeurEtObservable.nouveau<ModeTable>(this.transformeModeFnc(this.pModeActionIO.valeur));
        this.modeTableSouscritAModeAction();
        this.pUtile = new CLFUtile(this);
        this.pUtile.observeModeTable(this.pModeTableIO);
        this.utile.observeModeAction(this.pModeActionIO);
        // IMPORTANT à faire après la création des condi
        const siteObs = this.navigation.siteObs();
        siteObs.subscribe(site1 => {
            this.pModeActionIO.changeValeur(this.transformeSiteFnc(site1));
        });
    }

    get utile(): CLFUtile {
        return this.pUtile as CLFUtile;
    }

    initialiseModeAction(modeAction: ModeAction, modeTable?: ModeTable) {
        if (modeAction) {
            if (modeTable) {
                this.pSubscriptionDeModeTableAModeAction.unsubscribe();
            }
            this.changeMode(modeAction);
            if (modeTable) {
                this.modeTableSouscritAModeAction();
            }
        }
        if (modeTable) {
            this.pModeTableIO.changeValeur(modeTable);
        }
    }

    get modeActionIO(): ValeurEtObservable<ModeAction> {
        return this.pModeActionIO;
    }

    get modeAction(): ModeAction {
        return this.pModeActionIO.valeur;
    }

    changeMode(mode: ModeAction) {
        this.pModeActionIO.changeValeur(mode);
    }

    // Actions sur les commandes

    protected _paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string } {
        //        params.dateCatalogue = null;
        return params;
    }

    protected paramsVide(): { [param: string]: string } {
        const params: { [param: string]: string } = {};
        return this._paramsAvecContexte(params);
    }

    protected paramsKeyLigne(ligne: CLFLigne): { [param: string]: string } {
        const params = KeyUidRnoNo2.créeParams(ligne);
        return this._paramsAvecContexte(params);
    }

    /**
     * Contient key et àFixer de la ligne
     */
    protected paramsFixeLigne(ligne: CLFLigne): { [param: string]: string } {
        const params = KeyUidRnoNo2.créeParams(ligne);
        params.aFixer = '' + ligne.aFixerAEnvoyer;
        return this._paramsAvecContexte(params);
    }

    protected paramsKeyClient(ikeyClient: IKeyUidRno): { [param: string]: string } {
        const params = KeyUidRno.créeParams(ikeyClient);
        return this._paramsAvecContexte(params);
    }

    protected paramsKeyCommande(ikeyCommande: IKeyUidRnoNo): { [param: string]: string } {
        const params = KeyUidRnoNo.créeParams(ikeyCommande);
        return this._paramsAvecContexte(params);
    }

    /**
     * 
     * @param demandeApi fonction retournant l'Observable du POST à l'Api
     * @param metAJourStock fonction de mise à jour du stock si l'action réussit
     * @param urlSiOk si présent, quand l'action a réussi, redirection après la mise à jour du stock
     * @param formulaire 
     * @param afficheResultat 
     * @returns 
     */
    private apiRequêteAction(
        demandeApi: () => Observable<ApiResult>,
        metAJourStock?: (stock: CLFDocs, créé?: any) => void,
        urlSiOk?: IUrlDef,
        formulaire?: KfSuperGroupe,
        afficheResultat?: AfficheResultat
    ): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire,
            demandeApi,
            actionSiOk: (créé?: any): void => {
                const stock = this.litStock();
                metAJourStock(stock, créé);
                this.fixeStock(stock);
                if (urlSiOk) {
                    this.routeur.navigueUrlDef(urlSiOk);
                }
            },
            afficheResultat,
            traiteErreur: this.traiteErreur
        };
        return apiRequêteAction;
    }

    /**
     * Crée une nouvelle commande vide d'un client.
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    public apiRequêteCrée(type: TypeCLF, ikeyClient: IKeyUidRno, formulaire?: KfSuperGroupe, afficheResultat?: AfficheResultat): ApiRequêteAction {
        let controller: string;
        switch (type) {
            case 'commande':
                controller = ApiController.commande;
                break;
            case 'livraison':
                controller = ApiController.livraison;
                break;
            default:
                break;
        }
        if (controller) {
            return this.apiRequêteAction(
                () => this.post(controller, ApiAction.bon.nouveau, null, this.paramsKeyClient(ikeyClient)),
                (stock: CLFDocs, créé: ApiDocument) => stock.quandBonCréé(créé),
                this.utile.url.bon(),
                formulaire,
                afficheResultat
            );
        }
    }

    /**
     * Crée une nouvelle commande d'un client copie de la précédente commande.
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    public apiRequêteCréeCopie(type: TypeCLF, ikeyClient: IKeyUidRno, formulaire?: KfSuperGroupe, afficheResultat?: AfficheResultat): ApiRequêteAction {
        let controller: string;
        switch (type) {
            case 'commande':
                controller = ApiController.commande;
                break;
            case 'livraison':
                controller = ApiController.livraison;
                break;
            default:
                break;
        }
        if (controller) {
            return this.apiRequêteAction(
                () => this.post(controller, ApiAction.bon.clone, null, this.paramsKeyClient(ikeyClient)),
                (stock: CLFDocs, créé: ApiDocument) => stock.quandBonCréé(créé),
                this.utile.url.bon(),
                formulaire,
                afficheResultat
            );
        }
        return this.apiRequêteAction(
            () => this.post(ApiController.commande, ApiAction.bon.clone, null, this.paramsKeyClient(ikeyClient)),
            (stock: CLFDocs, créé: ApiDocument) => stock.quandBonCréé(créé),
            this.utile.url.bon(),
            formulaire,
            afficheResultat
        );
    }

    /**
     * Si l'utilisateur a créé la commande, supprime la commande et toutes ses lignes.
     * @param ikeyCommande tout objet ayant l'uid, le rno et le no de la commande
     */
    supprimeOuRefuse$(ikeyCommande: IKeyUidRnoNo) {
        return this.post(ApiController.commande, ApiAction.bon.efface, null, this.paramsKeyCommande(ikeyCommande));
    }
    /** actionSiOk de supprimeOuRefuse si l'utilisateur est le fournisseur */
    siSupprimeOuRefuseOk(ikeyCommande: IKeyUidRnoNo) {
        const géreDocs = this.litStock();
        géreDocs.quandSupprimeOuRefuse(ikeyCommande);
        this.fixeStock(géreDocs);
    }

    // Actions sur les lignes

    /**
     * ajoute une ligne
     * @param ligne ligne à ajouter
     * @param ajout true pour un ajout
     */
    private ajouteLigne(ligne: CLFLigne): Observable<ApiResult> {
        const controller = this.controller(ligne.parent.type);
        const apiLigne = ligne.apiLigneAEnvoyer();
        return this.post<ApiLigne>(controller, ApiAction.bon.ajoute, apiLigne, this.paramsVide());
    }
    /**
     * modifie une ligne
     * @param ligne ligne à modifier
     */
    private editeLigne(ligne: CLFLigne): Observable<ApiResult> {
        const controller = this.controller(ligne.parent.type);
        const apiLigne = ligne.apiLigneAEnvoyer();
        return this.put<ApiLigne>(controller, ApiAction.docCLF.edite, apiLigne, this.paramsVide());
    }

    /**
     * Modifie une ligne
     * @param ligne ligne modifiée à sauvegarder
     */
    public apiRequêteEditeLigne(ligne: CLFLigne, formulaire?: KfSuperGroupe, afficheResultat?: AfficheResultat): ApiRequêteAction {
        return this.apiRequêteAction(
            () => this.editeLigne(ligne),
            (stock: CLFDocs) => stock.quandLigneEditée(ligne),
            this.utile.url.bon(),
            formulaire,
            afficheResultat
        );
    }

    /**
     * Ajoute une ligne
     * @param ligne ligne à ajouter
     */
    public apiRequêteAjouteLigne(ligne: CLFLigne, formulaire?: KfSuperGroupe, afficheResultat?: AfficheResultat): ApiRequêteAction {
        return this.apiRequêteAction(
            () => this.ajouteLigne(ligne),
            (stock: CLFDocs) => stock.quandLigneEditée(ligne),
            this.utile.url.bon(),
            formulaire,
            afficheResultat
        );
    }

    /**
     * Supprime une ligne
     * @param ligne ligne à supprimer
     * @param rafraichitTable fonction à appeler après la mise à jour du stock
     */
    public apiRequêteSupprimeLigne(ligne: CLFLigne, rafraichitTable: (stock: CLFDocs) => void): ApiRequêteAction {
        return this.apiRequêteAction(
            () => this.delete(ApiController.commande, ApiAction.bon.supprime, this.paramsKeyLigne(ligne)),
            (stock: CLFDocs) => {
                stock.quandLigneSupprimée(ligne);
                rafraichitTable(stock);
            }
        );
    }

    /**
     * Fixe la valeur de AFixer de la ligne
     */
    public apiRequêtefixeAFixer(ligne: CLFLigne, formulaire?: KfSuperGroupe): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.fixe, null, this.paramsFixeLigne(ligne)),
            (stock: CLFDocs) => stock.quandAFixerFixé(ligne),
        );
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour la ligne
     */
    public apiRequêteCopieSourceDansAFixer1(ligne: CLFLigne): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.copie1, null, this.paramsKeyLigne(ligne)),
            (stock: CLFDocs) => stock.quandSourceCopiéeDansAFixer1(ligne),
        );
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour chaque ligne du document
     */
    public apiRequêteCopieSourceDansAFixerDoc(doc: CLFDoc, rafraichitTable?: () => void): ApiRequêteAction {
        const controller = this.controller(doc.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.copie1, null, KeyUidRnoNo.créeParams(doc)),
            (stock: CLFDocs) => {
                stock.quandSourceCopiéeDansAFixerDoc(doc);
                rafraichitTable();
            },
        );
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour chaque ligne des documents
     * dont le client est celui du clfDocs et le numéro l'un de ceux des documents du clfDocs
     */
    public apiRequêteCopieSourceDansAFixerDocs(doc: CLFDoc, rafraichitTable?: () => void): ApiRequêteAction {
        const controller = this.controller(doc.type);
        const clfDocs = doc.apiSynthèseAEnvoyer(d => d.lignes && d.nbCopiables > 0);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.copieT, clfDocs),
            (stock: CLFDocs) => {
                stock.quandSourceCopiéeDansAFixerDocs(doc);
                rafraichitTable();
            },
        );
    }

    /**
     * Annule la valeur de AFixer pour la ligne
     * @param rafraichitTable fonction à appeler après la mise à jour du stock
     */
    public apiRequêteAnnuleLigne(ligne: CLFLigne, rafraichitTable?: () => void): ApiRequêteAction {
        const demandeApi = () => {
            ligne.aFixer = 0;
            return this.editeLigne(ligne);
        };
        return rafraichitTable
            ? this.apiRequêteAction(
                demandeApi,
                (stock: CLFDocs) => {
                    stock.quandLigneEditée(ligne);
                    rafraichitTable();
                },
            )
            : this.apiRequêteAction(
                demandeApi,
                (stock: CLFDocs) => stock.quandLigneEditée(ligne),
                this.utile.url.bon(),
            );
    }

    /**
     * Annule la valeur de AFixer pour chaque ligne du document
     * @param rafraichitTable fonction à appeler après la mise à jour du stock
     */
    public apiRequêteAnnuleDoc(doc: CLFDoc, rafraichitTable: () => void): ApiRequêteAction {
        const controller = this.controller(doc.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.annuleD, null, KeyUidRnoNo.créeParams(doc)),
            (stock: CLFDocs) => {
                stock.quandAnnuleDoc(doc);
                rafraichitTable();
            },
        );
    }

    /**
     * Annule la valeur de AFixer pour chaque ligne des documents
     * dont le client est celui du clfDocs et le numéro l'un de ceux des documents du clfDocs
     * @param rafraichitTable fonction à appeler après la mise à jour du stock
     */
    public apiRequêteAnnuleDocs(doc: CLFDoc, rafraichitTable: () => void): ApiRequêteAction {
        const controller = this.controller(doc.type);
        const clfDocs = doc.apiSynthèseAEnvoyer(d => d.lignes && d.nbCopiables > 0);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.copieT, clfDocs),
            (stock: CLFDocs) => {
                stock.quandAnnuleDocs(doc);
                rafraichitTable();
            },
        );
    }

    envoi(document: CLFDoc): Observable<ApiResult> {
        if (document.type === 'commande') {
            const params: { [param: string]: string } = this.paramsKeyClient(document.client);
            return this.post(ApiController.commande, ApiAction.docCLF.envoi, null, params);
        } else {
            const controller = this.controller(document.type);
            const clfDocs = document.apiSynthèseAEnvoyer(d => d.choisi);
            return this.post(controller, ApiAction.docCLF.envoi, clfDocs);
        }
    }
}
