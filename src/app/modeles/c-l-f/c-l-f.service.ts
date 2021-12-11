import { Subscription, Observable } from 'rxjs';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { Site } from '../site/site';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
import { ModeAction } from './condition-action';
import { ApiDoc } from './api-doc';
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
import { ApiLigneAEnvoyer } from './api-ligne';
import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { CLFDocs } from './c-l-f-docs';
import { TypeCLF } from './c-l-f-type';
import { Client } from '../client/client';
import { DATE_NULLE } from '../date-nulle';

/**
 * Implémentations: ClientCLFService, FournisseurCLFService
 */
export abstract class CLFService extends CLFLectureService {

    private pModeActionIO: ValeurEtObservable<ModeAction>;
    private pSubscriptionDeModeTableAModeAction: Subscription;

    /**
     * Valeur et Observable créé par la version fournisseur du service
     */
    clientEnCoursIo: ValeurEtObservable<Client>;

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
            return site.ouvert ? ModeAction.edite : ModeAction.aperçu;
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
        const site = this.litSiteEnCours();
        this.pModeActionIO = ValeurEtObservable.nouveau<ModeAction>(this.transformeSiteFnc(site));
        this.pModeTableIO = ValeurEtObservable.nouveau<ModeTable>(this.transformeModeFnc(this.pModeActionIO.valeur));
        this.modeTableSouscritAModeAction();
        this.pUtile = new CLFUtile(this);
        this.pUtile.observeModeTable(this.pModeTableIO);
        this.utile.observeModeAction(this.pModeActionIO);
        // IMPORTANT à faire après la création des condi
        this.identification.souscritASiteChange(((s: Site) => this.pModeActionIO.changeValeur(this.transformeSiteFnc(s))).bind(this));
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

    /**
     * Contextualise si besoin les paramétres d'une requête.
     * Si l'utilisateur est le client, ajoute la date du catalogue du stock aux paramétres de la requête.
     * @param params paramétres de la requête
     * @returns params contextualisé
     */
    protected abstract paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string };

    /**
     * Paramètre de requête vide.
     * Si l'utilisateur est le client la date de l'état du site est ajouté.
     */
    protected paramsVide(): { [param: string]: string } {
        const params: { [param: string]: string } = {};
        return this.paramsAvecContexte(params);
    }

    /**
     * Paramètre de requête contenant la key du bon de la ligne et le no du produit de la ligne.
     * Si l'utilisateur est le client la date de l'état du site est ajouté.
     */
    private paramsKeyLigne(ligne: CLFLigne): { [param: string]: string } {
        const params = KeyUidRnoNo.créeParams(ligne);
        params['no2'] = '' + ligne.no2;
        return this.paramsAvecContexte(params);
    }

    /**
     * Paramètre de requête contenant la key du client.
     * Si l'utilisateur est le client la date de l'état du site est ajouté.
     */
    protected paramsKeyClient(ikeyClient: IKeyUidRno): { [param: string]: string } {
        const params = KeyUidRno.créeParams(ikeyClient);
        return this.paramsAvecContexte(params);
    }

    /**
     * Paramètre de requête contenant la key du bon.
     * Si l'utilisateur est le client la date de l'état du site est ajouté.
     */
    private paramsKeyBon(ikeyBon: IKeyUidRnoNo): { [param: string]: string } {
        const params = KeyUidRnoNo.créeParams(ikeyBon);
        return this.paramsAvecContexte(params);
    }

    private fixeTraiteErreur(apiRequêteAction: ApiRequêteAction) {
        apiRequêteAction.traiteErreur = (apiResult: ApiResult) => {
            const traité = this.traiteErreur(apiResult);
            if (traité) {
                const urlDef = this.utile.url.sitePasOuvert();
                urlDef.params = [{ nom: 'err', valeur: '409' }];
                this.routeur.navigueUrlDef(urlDef);
            }
            return traité;
        }
    }

    /**
     * 
     * @param demandeApi fonction retournant l'Observable du POST à l'Api
     * @param metAJourStock fonction appelée si l'action réussit pour mettre à jour le stock et événtuellement la ligne ou le doc paramétre de la requête
     * @param urlSiOk si présent, quand l'action a réussi, redirection après la mise à jour du stock
     * @param formulaire 
     * @param afficheResultat 
     * @returns 
     */
    private apiRequêteAction(
        demandeApi: () => Observable<ApiResult>,
        metAJourStock: (stock: CLFDocs, créé?: any) => void,
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
        };
        if (this.traiteErreur) {
            this.fixeTraiteErreur(apiRequêteAction);
        }
        return apiRequêteAction;
    }

    /**
     * Crée un nouveau bon vide d'un client.
     * @param type 'commande' ou 'livraison'
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
                (stock: CLFDocs, créé: ApiDoc) => stock.quandBonCréé(créé),
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
                (stock: CLFDocs, créé: ApiDoc) => stock.quandBonCloné(créé),
                this.utile.url.bon(),
                formulaire,
                afficheResultat
            );
        }
        return this.apiRequêteAction(
            () => this.post(ApiController.commande, ApiAction.bon.clone, null, this.paramsKeyClient(ikeyClient)),
            (stock: CLFDocs, créé: ApiDoc) => stock.quandBonCréé(créé, true),
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
        return this.post(ApiController.commande, ApiAction.bon.efface, null, this.paramsKeyBon(ikeyCommande));
    }
    /** actionSiOk de supprimeOuRefuse si l'utilisateur est le fournisseur */
    siSupprimeOuRefuseOk(ikeyCommande: IKeyUidRnoNo) {
        const géreDocs = this.litStock();
        géreDocs.quandSupprimeOuRefuse(ikeyCommande);
        this.fixeStock(géreDocs);
    }

    // Actions sur les lignes

    /**
     * Modifie une ligne d'une commande si l'utilisateur est le client, d'un bon virtuel si l'utilisateur est le fournisseur.
     * @param ligne ligne modifiée à sauvegarder
     */
    public apiRequêteEditeLigne(ligne: CLFLigne, formulaire?: KfSuperGroupe, afficheResultat?: AfficheResultat): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        const apiLigne = ligne.apiLigneAEnvoyer();
        return this.apiRequêteAction(
            () => {
                return this.put<ApiLigneAEnvoyer>(controller, ApiAction.docCLF.edite, apiLigne, this.paramsVide());
            },
            (stock: CLFDocs) => stock.quandLigneEditée(ligne),
            this.utile.url.bon(),
            formulaire,
            afficheResultat
        );
    }

    /**
     * Ajoute une ligne à une commande si l'utilisateur est le client, à un bon virtuel si l'utilisateur est le fournisseur.
     * @param ligne ligne à ajouter
     */
    public apiRequêteAjouteLigne(ligne: CLFLigne, formulaire?: KfSuperGroupe, afficheResultat?: AfficheResultat): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        return this.apiRequêteAction(
            () => {
                ligne.apiLigne.date = ligne.parent.clfDocs.site.dateCatalogue;
                const apiLigne = ligne.apiLigneAEnvoyer();
                return this.post<ApiLigneAEnvoyer>(controller, ApiAction.bon.ajoute, apiLigne, this.paramsVide());
            },
            (stock: CLFDocs) => stock.quandLigneEditée(ligne),
            this.utile.url.bon(),
            formulaire,
            afficheResultat
        );
    }

    /**
     * Supprime une ligne d'une commande si l'utilisateur est le client, d'un bon virtuel si l'utilisateur est le fournisseur.
     * @param ligne ligne à supprimer
     * @param rafraichitComponent fonction qui met à jour la vueTable et le CLFDoc du component (appelée après la mise à jour du stock).
     * Le paramétre index est l'index commun des objets correspondant à la ligne dans toutes les listes contenant un objet correspondant à la ligne.
     */
    public apiRequêteSupprimeLigne(ligne: CLFLigne, rafraichitComponent: (stock: CLFDocs, index: number) => void): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        return this.apiRequêteAction(
            () => {
                const params = this.paramsKeyBon(ligne);
                params.no2 = '' + ligne.no2;
                return this.delete(controller, ApiAction.bon.supprime, this.paramsKeyLigne(ligne));
            },
            (stock: CLFDocs) => {
                // Les lignes d'un bon ont toutes la même date Date_Nulle, leur no2 (no de produit) suffit à les distinguer.
                const index = ligne.parent.lignes.findIndex(l => l.no2 === ligne.no2)
                stock.quandLigneSupprimée(index);
                rafraichitComponent(stock, index);
            }
        );
    }

    /**
     * Fixe la valeur de AFixer de la ligne dans la bdd avec celle du kfAFixer de l'éditeur.
     * Si l'api retourne Ok, met à jour le stock et l'ApiData de la ligne.
     * @param ligne CLFLigne en cours d'édition
     */
    public apiRequêtefixeAFixer(ligne: CLFLigne): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        return this.apiRequêteAction(
            () => {
                const params = KeyUidRnoNo2.créeParams(ligne);
                params.aFixer = '' + ligne.éditeur.kfAFixer.valeur;
                return this.post(controller, ApiAction.docCLF.fixe, null, params);
            },
            (stock: CLFDocs) => stock.quandAFixerFixé(ligne),
        );
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour la ligne.
     * Si l'api retourne Ok, met à jour le stock et l'ApiData et le kfAFixer de la ligne.
     * @param ligne CLFLigne en cours d'édition
     */
    public apiRequêteCopieQuantitéDansAFixerLigne(ligne: CLFLigne): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.copie1, null, KeyUidRnoNo2.créeParams(ligne)),
            (stock: CLFDocs) => stock.quandQuantitéCopiéeDansAFixerLigne(ligne),
        );
    }

    /**
     * Annule la valeur de AFixer pour la ligne.
     * Si l'api retourne Ok, met à jour le stock et l'ApiData et le kfAFixer de la ligne.
     * @param ligne CLFLigne en cours d'édition
     */
    public apiRequêteAnnuleLigne(ligne: CLFLigne): ApiRequêteAction {
        const controller = this.controller(ligne.parent.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.annule1, null, KeyUidRnoNo2.créeParams(ligne)),
            (stock: CLFDocs) => stock.quandAnnuleLigne(ligne),
        );
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour chaque ligne du bon où c'est possible.
     * Si l'api retourne Ok, met à jour le stock et les ApiData (et les kfAFixer s'ils existent) des lignes modifiées.
     * @param bon bon d'une synthèse (sur la page de sa table ou dans un ligne de la table de la page bons)
     * @param quandBonModifié si présent, fonction de rafraichissement de la page après mise à jour du bon.
     */
    public apiRequêteCopieQuantitéDansAFixerDoc(bon: CLFDoc, quandBonModifié?: (bon: CLFDoc) => void): ApiRequêteAction {
        const controller = this.controller(bon.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.copieD, null, KeyUidRnoNo.créeParams(bon)),
            (stock: CLFDocs) => {
                stock.quandQuantitéCopiéeDansAFixerDoc(bon);
                if (quandBonModifié) {
                    quandBonModifié(bon);
                }
            },
        );
    }

    /**
     * Annule la valeur de AFixer pour chaque ligne du document
     * @param quandBonModifié fonction à appeler après la mise à jour du stock
     */
    public apiRequêteAnnuleDoc(bon: CLFDoc, quandBonModifié?: (bon: CLFDoc) => void): ApiRequêteAction {
        const controller = this.controller(bon.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.docCLF.annuleD, null, KeyUidRnoNo.créeParams(bon)),
            (stock: CLFDocs) => {
                stock.quandAnnuleDoc(bon);
                if (quandBonModifié) {
                    quandBonModifié(bon);
                }
            },
        );
    }

    /**
     * Copie la valeur de Quantité dans AFixer pour chaque ligne des documents
     * dont le client est celui du clfDocs et le numéro l'un de ceux des documents du clfDocs.
     */
    public apiRequêteCopieQuantitéDansAFixerDocs(doc: CLFDoc, rafraichitTable?: () => void): ApiRequêteAction {
        const controller = this.controller(doc.type);
        return this.apiRequêteAction(
            () => {
                const clfDocs = doc.apiSynthèseAEnvoyer(d => d.lignes && d.nbCopiables > 0);
                return this.post(controller, ApiAction.docCLF.copieT, clfDocs);
            },
            (stock: CLFDocs) => {
                stock.quandQuantitéCopiéeDansAFixerDocs(doc);
                rafraichitTable();
            },
        );
    }

    /**
     * Supprime le bon virtuel
     * @param rafraichitTable fonction à appeler après la mise à jour du stock
     */
    public apiRequêteSupprimeBonVirtuel(doc: CLFDoc, rafraichitTable?: () => void): ApiRequêteAction {
        const controller = this.controller(doc.type);
        return this.apiRequêteAction(
            () => this.post(controller, ApiAction.bon.efface, null, KeyUidRnoNo.créeParams(doc)),
            (stock: CLFDocs) => {
                stock.quandSupprimeBonVirtuel();
                if (rafraichitTable) {
                    rafraichitTable();
                }
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
        return this.apiRequêteAction(
            () => {
                const clfDocs = doc.apiSynthèseAEnvoyer(d => d.lignes && d.nbCopiables > 0);
                return this.post(controller, ApiAction.docCLF.copieT, clfDocs);
            },
            (stock: CLFDocs) => {
                stock.quandAnnuleDocs(doc);
                rafraichitTable();
            },
        );
    }

    public apiRequêteEnvoi(clfDoc: CLFDoc, formulaire: KfSuperGroupe, afficheResultat: AfficheResultat): ApiRequêteAction {
        const controller = this.controller(clfDoc.type);
        const apiRequêteAction = new ApiRequêteAction();
        apiRequêteAction.formulaire = formulaire;
        apiRequêteAction.afficheResultat = afficheResultat;
        if (clfDoc.type === 'commande') {
            apiRequêteAction.demandeApi = () => {
                const params: { [param: string]: string } = this.paramsKeyClient(clfDoc.client);
                return this.post(controller, ApiAction.docCLF.envoi, null, params);
            };
            apiRequêteAction.actionSiOk = (créé: ApiDoc): void => {
                clfDoc.apiDoc.date = créé.date;
                this.videStock();
                this.changeMode(ModeAction.envoyé);
            };
            this.fixeTraiteErreur(apiRequêteAction);
        } else {
            apiRequêteAction.demandeApi = () => {
                const clfDocs = clfDoc.apiSynthèseAEnvoyer(d => d.choisi);
                return this.post(controller, ApiAction.docCLF.envoi, clfDocs);
            };
            apiRequêteAction.actionSiOk = (créé: ApiDoc): void => {
                clfDoc.apiDoc.date = créé.date;
                const stock = this.litStock();
                clfDoc.apiDoc.no = créé.no;
                const inclus = stock.apiDocs.filter(a => a.choisi);
                stock.apiDocs = stock.apiDocs.filter(a => !a.choisi);
                if (inclus.length === 1 && inclus[0].no === 0) {
                    // la synthèse a été créée à partir du bon virtuel seul, elle peut servir de modèle
                    // pour la création d'un bon virtuel
                    const apiDocModéleBonVirtuel = new ApiDoc();
                    apiDocModéleBonVirtuel.uid = clfDoc.uid;
                    apiDocModéleBonVirtuel.rno = clfDoc.rno;
                    apiDocModéleBonVirtuel.no = 0;
                    apiDocModéleBonVirtuel.date = créé.date;
                    apiDocModéleBonVirtuel.noGroupe = créé.noGroupe;
                    apiDocModéleBonVirtuel.lignes = clfDoc.lignes.map(l => l.apiLigne);
                    stock.apiDocs.unshift(apiDocModéleBonVirtuel);
                }
                this.fixeStock(stock);
                this.changeMode(ModeAction.envoyé);
            };
        }

        return apiRequêteAction;
    }
}
