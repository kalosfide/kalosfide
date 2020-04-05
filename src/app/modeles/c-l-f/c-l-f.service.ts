import { Subscription, Observable } from 'rxjs';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { Site } from '../site/site';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { ModeAction } from './condition-action';
import { ApiDocument } from './api-document';
import { CatalogueService } from '../catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { ClientService } from '../client/client.service';
import { CLFDoc } from './c-l-f-doc';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { CLFLectureService } from './c-l-f-lecture.service';
import { CLFUtile } from './c-l-f-utile';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { CLFLigne } from './c-l-f-ligne';
import { ApiLigne } from './api-ligne';
import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { IdEtatSite } from '../etat-site';

export abstract class CLFService extends CLFLectureService {

    private pModeActionIO: KfInitialObservable<ModeAction>;
    private pSubscriptionDeModeTableAModeAction: Subscription;

    constructor(
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(catalogueService, stockageService, clientService, apiRequeteService);
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
                    return ModeTable.bilan;
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
        this.pModeActionIO = KfInitialObservable.nouveau<ModeAction>(this.transformeSiteFnc(site));
        this.pModeTableIO = KfInitialObservable.nouveau<ModeTable>(this.transformeModeFnc(this.pModeActionIO.valeur));
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

    get modeActionIO(): KfInitialObservable<ModeAction> {
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
     * Crée une nouvelle commande vide d'un client
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    créeVide(ikeyClient: IKeyUidRno): Observable<ApiResult> {
        return this.post(ApiController.commande, ApiAction.commande.nouveau, null, this.paramsKeyClient(ikeyClient));
    }
    /** actionSiOk de créeVide */
    siCréeVideOk(créé: ApiDocument) {
        const documents = this.litStock();
        documents.quandCommandeCréée(créé);
        this.fixeStock(documents);
    }

    /**
     * Crée une nouvelle commande d'un client en copiant les lignes de la commande précédente
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    créeCopie(ikeyClient: IKeyUidRno): Observable<ApiResult> {
        return this.post(ApiController.commande, ApiAction.commande.clone, null, this.paramsKeyClient(ikeyClient));
    }
    /** actionSiOk de créeCopie */
    siCréeCopieOk(créé: ApiDocument) {
        const documents = this.litStock();
        documents.quandCommandeCréée(créé, true);
        this.fixeStock(documents);
    }

    /**
     * Si l'utilisateur a créé la commande, supprime la commande et toutes ses lignes.
     * @param ikeyCommande tout objet ayant l'uid, le rno et le no de la commande
     */
    supprimeOuRefuse$(ikeyCommande: IKeyUidRnoNo) {
        return this.post(ApiController.commande, ApiAction.commande.efface, null, this.paramsKeyCommande(ikeyCommande));
    }
    /** actionSiOk de supprimeOuRefuse si l'utilisateur est le fournisseur */
    siSupprimeOuRefuseOk(ikeyCommande: IKeyUidRnoNo) {
        const géreDocs = this.litStock();
        géreDocs.quandSupprimeOuRefuse(ikeyCommande);
        this.fixeStock(géreDocs);
    }

    // Actions sur les lignes
    private _editeLigne(ligne: CLFLigne, ajout?: boolean): Observable<ApiResult> {
        const controller = this.controller(ligne.parent.type);
        const apiLigne = ligne.apiLigneAEnvoyer();
        return ajout
            ? this.post<ApiLigne>(controller, ApiAction.commande.ajoute, apiLigne, this.paramsVide())
            : this.put<ApiLigne>(controller, ApiAction.docCLF.edite, apiLigne, this.paramsVide());
    }
    /**
     * ajoute ou modifie une ligne
     * @param ligne ligne à ajouter ou à modifier
     * @param ajout true pour un ajout
     */
    editeLigne(ligne: CLFLigne, ajout?: boolean): Observable<ApiResult> {
        return this._editeLigne(ligne, ajout);
    }
    /** actionSiOk de editeLigne */
    siEditeLigneOk(ligne: CLFLigne) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Documents: Pas de stock');
        }
        stock.quandLigneEditée(ligne);
        this.fixeStock(stock);
    }

    protected _supprimeLigne(ligne: CLFLigne): Observable<ApiResult> {
        return this.delete(ApiController.commande, ApiAction.commande.supprime, this.paramsKeyLigne(ligne));
    }
    /**
     * supprime une ligne
     * @param ligne ligne à supprimer
     */
    supprimeLigne(ligne: CLFLigne): Observable<ApiResult> {
        return this._supprimeLigne(ligne);
    }
    /** actionSiOk de supprimeLigne */
    siSupprimeLigneOk(ligne: CLFLigne) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandLigneSupprimée(ligne);
        this.fixeStock(stock);
    }

    /**
     * Fixe la valeur de AFixer de la ligne
     */
    fixeAFixer(ligne: CLFLigne): Observable<ApiResult> {
        const controller = this.controller(ligne.parent.type);
        return this.post(controller, ApiAction.docCLF.fixe, null, this.paramsFixeLigne(ligne));
    }
    sifixeAFixerOk(ligne: CLFLigne) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandAFixerFixé(ligne);
        this.fixeStock(stock);
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour la ligne
     */
    copieSourceDansAFixer1(ligne: CLFLigne): Observable<ApiResult> {
        const controller = this.controller(ligne.parent.type);
        return this.post(controller, ApiAction.docCLF.copie1, null, KeyUidRnoNo2.créeParams(ligne));
    }
    /** actionSiOk de supprimeLigne */
    siCopieSourceDansAFixer1Ok(ligne: CLFLigne) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandSourceCopiéeDansAFixer1(ligne);
        this.fixeStock(stock);
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour chaque ligne du document
     */
    copieSourceDansAFixerDoc(doc: CLFDoc): Observable<ApiResult> {
        const controller = this.controller(doc.type);
        return this.post(controller, ApiAction.docCLF.copieD, null, KeyUidRnoNo.créeParams(doc));
    }
    siCopieSourceDansAFixerDocOk(doc: CLFDoc) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandSourceCopiéeDansAFixerDoc(doc);
        this.fixeStock(stock);
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour chaque ligne des documents
     * dont le client est celui du clfDocs et le numéro l'un de ceux des documents du clfDocs
     */
    copieSourceDansAFixerDocs(doc: CLFDoc): Observable<ApiResult> {
        const controller = this.controller(doc.type);
        const clfDocs = doc.apiSynthèseAEnvoyer(d => d.lignes && d.nbCopiables > 0);
        return this.post(controller, ApiAction.docCLF.copieT, clfDocs);
    }
    siCopieSourceDansAFixerDocsOk(doc: CLFDoc) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandSourceCopiéeDansAFixerDocs(doc);
        this.fixeStock(stock);
    }

    /**
     * Annule la valeur de AFixer pour chaque ligne du document
     */
    annuleLigne(ligne: CLFLigne): Observable<ApiResult> {
        const controller = this.controller(ligne.parent.type);
        return this.post(controller, ApiAction.docCLF.annule1, null, KeyUidRnoNo2.créeParams(ligne));
    }
    siAnnuleLigneOk(ligne: CLFLigne) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandAnnule1(ligne);
        this.fixeStock(stock);
    }

    /**
     * Annule la valeur de AFixer pour chaque ligne du document
     */
    annuleDoc(doc: CLFDoc): Observable<ApiResult> {
        const controller = this.controller(doc.type);
        return this.post(controller, ApiAction.docCLF.annuleD, null, KeyUidRnoNo.créeParams(doc));
    }
    siAnnuleDocOk(doc: CLFDoc) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandAnnuleDoc(doc);
        this.fixeStock(stock);
    }

    /**
     * Annule la valeur de AFixer pour chaque ligne des documents
     * dont le client est celui du clfDocs et le numéro l'un de ceux des documents du clfDocs
     */
    annuleDocs(doc: CLFDoc): Observable<ApiResult> {
        const controller = this.controller(doc.type);
        const clfDocs = doc.apiSynthèseAEnvoyer(d => d.lignes && d.nbCopiables > 0);
        return this.post(controller, ApiAction.docCLF.copieT, clfDocs);
    }
    siAnnuleDocsOk(doc: CLFDoc) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        stock.quandSourceCopiéeDansAFixerDoc(doc);
        this.fixeStock(stock);
    }

    envoieBon(document: CLFDoc): Observable<ApiResult> {
        if (document.type === 'commande') {
            const params: { [param: string]: string } = this.paramsKeyClient(document.client);
            return this.post(ApiController.commande, ApiAction.docCLF.envoi, null, params);
        } else {
            const controller = this.controller(document.type);
            const clfDocs = document.apiSynthèseAEnvoyer(d => d.choisi);
            return this.post(controller, ApiAction.docCLF.envoi, clfDocs);
        }
    }

    /**
     * efface le stock
     */
    quandEnvoyé() {
        this.pStockage.initialise();
    }
}
