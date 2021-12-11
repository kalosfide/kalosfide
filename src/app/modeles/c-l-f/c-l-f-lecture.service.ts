import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { Observable, of } from 'rxjs';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
import { ApiDoc } from './api-doc';
import { CatalogueService } from '../catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Stockage } from 'src/app/services/stockage/stockage';
import { CLFDocs } from './c-l-f-docs';
import { map, concatMap } from 'rxjs/operators';
import { ApiDocs, ApiDocsAvecTarifEtClient } from './api-docs';
import { ApiController, ApiAction } from 'src/app/api/api-route';
import { ClientService } from '../client/client.service';
import { TypeCLF } from './c-l-f-type';
import { CLFNbBons } from './c-l-f-nb-bons';
import { CLFFiltre } from './c-l-f-filtre';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { CLFDoc } from './c-l-f-doc';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { Client } from '../client/client';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Site } from '../site/site';

export abstract class CLFLectureService extends KeyUidRnoNoService<ApiDoc> {

    private pStockage: Stockage<CLFDocs>;

    private pBilanIO?: ValeurEtObservable<CLFNbBons>;

    /**
     * Définit les paramétres à envoyer à l'api pour recevoir une liste de documents vérifiant certaines conditions.
     */
    protected pFiltre: CLFFiltre;

    /**
     * Défini par la classe dérivée Client.
     * Traite l'erreur retournée par l'Api quand le contexte a changé.
     */
    public traiteErreur: (apiResult: ApiResult) => boolean;

    caseToutSélectionner: KfCaseACocher;

    constructor(
        nomStockage: string,
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(stockageService, apiRequeteService);
        this.pStockage = stockageService.nouveau<CLFDocs>(nomStockage, {
            // Le stockage sera réinitialisé à chaque changement de site ou d'identifiant
            rafraichi: true,
        });
        this.pBilanIO = ValeurEtObservable.nouveau(CLFNbBons.bilanVide());
    }

    controller(type: TypeCLF): string {
        return type === 'commande'
            ? ApiController.commande
            : type === 'livraison'
                ? ApiController.livraison
                : ApiController.facture;
    }

    typeASynthétiser(type: TypeCLF): TypeCLF {
        return type === 'livraison'
            ? 'commande'
            : type === 'facture'
                ? 'livraison'
                : undefined;
    }

    /**
     * Enregistre dans le stock le changement de valeur de la propriété qui indique si le bon fera partie de la synthèse
     * et emet un observable du bilan
     * @param noBon no du document
     * @param choisi true ou false
     */
    changeChoisi(noBon: number, choisi: boolean) {
        const clfDocs = this.litStock();
        clfDocs.changeChoisi(noBon, choisi);
        this.fixeStock(clfDocs);
    }

    /**
     * Enregistre dans le stock le changement de valeur de la propriété qui indique si le document fera partie de la synthèse
     * et emet un observable du bilan
     * @param noDoc no du document
     * @param choisi true ou false
     */
    changeChoisis(synthèse: CLFDoc, choisi: boolean) {
        const clfDocs = this.litStock();
        // appel à changeChoisi pour chaque bon
        synthèse.àSynthétiser
            .filter(bon => bon.préparé)
            .forEach(bon => {
                const kfChoisi = bon.éditeur.kfChoisi;
                kfChoisi.gereHtml.actionSansSuiviValeur(() => kfChoisi.valeur = choisi)();
                clfDocs.changeChoisi(bon.no, choisi);
            });
        this.fixeStock(clfDocs);
    }

    /**
     * ValeurEtObservable qui émet le bilan d'une synthèse chaque fois que le stock est enregistré. 
     */
    get clfBilanIO(): ValeurEtObservable<CLFNbBons> {
        return this.pBilanIO;
    }

    /**
     * Retourne un CLFDocs avec méthodes créé en copiant le stock si le stock existe
     */
    litStockSiExistant(): CLFDocs {
        const stocké = this.pStockage.litStock();
        if (stocké) {
            const stock = new CLFDocs();
            stock.copie(stocké);
            stock.catalogue = this.catalogueService.litStockSiExistant();
            return stock;
        }
    }

    /**
     * Retourne un CLFDocs avec méthodes créé en copiant le stock.
     * Lance une erreur si le stockage est vide.
     */
    litStock(): CLFDocs {
        const stock = this.litStockSiExistant();
        if (!stock) {
            throw new Error(`${this.pStockage.nom}: Pas de stock`);
        }
        return stock;
    }

    fixeStock(stock: CLFDocs) {
        if (!stock) {
            throw new Error(`${this.pStockage.nom}: Pas de stock`);
        }
        if (stock.type && stock.type !== 'commande' && !stock.estContexte) {
            stock.créeBilan();
        }
        this.pStockage.fixeStock(stock);
        if (stock.type && stock.type !== 'commande') {
            // L'observable du bilan émet si le bilan a changé
            this.pBilanIO.changeValeur(stock.clfBilan);
        }
    }

    videStock() {
        this.pStockage.vide();

    }

    // Lectures de CLFDocs

    /**
     * Définit les paramétres à envoyer à l'api pour recevoir une liste de documents vérifiant certaines conditions.
     */
    get filtre(): CLFFiltre {
        return this.pFiltre;
    }

    /**
     * Si le stock n'existe pas ou a un type ou n'a pas le bon client, lit dans l'Api un ApiDocs
     * qui contient la listes des résumés des documents d'un client avec leur type, crée et stocke un CLFDocs
     * avec les champs apiDocs, site et client mais pas de type.
     * Stocke le résultat.
     * @param keyClient présent si l'utilisateur est le fournisseur
     * @returns un Observale du CLFDocs stocké
     */
    clientAvecRésumésDocs(keyClient?: IKeyUidRno): Observable<CLFDocs> {
        const stock = this.litStockSiExistant();
        if (!stock
            || stock.type // ce n'est pas un clfDocs de résumés d'un client
            || (keyClient && !KeyUidRno.compareKey(stock.client, keyClient)) // il y a un client et ce n'est pas celui du stock
        ) {
            const role = this.identification.roleEnCours;
            const site = role.site;
            const controller = ApiController.document;
            const action = ApiAction.document.client;
            let client$: Observable<Client>;
            if (keyClient) {
                // l'utilisateur est le fournisseur
                client$ = this.clientService.client$(keyClient);
            } else {
                // l'utilisateur est le client
                const client = Client.deRole(role);
                client$ = of(client);
                keyClient = client;
            }
            if (!this.pFiltre || this.pFiltre.uid !== keyClient.uid || this.pFiltre.rno !== keyClient.rno) {
                this.pFiltre = new CLFFiltre(keyClient);
            }

            return this.lectureObs<ApiDocs>({
                demandeApi: () => this.get<ApiDocs>(controller, action, this.pFiltre.créeParams()),
            }).pipe(
                map(apiDocs => {
                    const clfDocs = new CLFDocs();
                    clfDocs.site = site;
                    clfDocs.apiDocs = apiDocs.apiDocs;
                    return clfDocs;
                }),
                concatMap(clfDocs => client$.pipe(
                    map(client => {
                        clfDocs.client = client;
                        this.fixeStock(clfDocs);
                        return clfDocs;
                    })
                ))
            );
        } else {
            return of(stock);
        }
    }

    /**
     * Pour le client et le fournisseur.
     * Le ApiDocs lu dans l'Api contient le document avec les lignes et le Client du client.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * @param keyClient key du client
     * @param no no du document
     * @param type type du document
     * Pas stocké.
     */
    document(keyClient: IKeyUidRno, no: number, type: TypeCLF): Observable<CLFDocs> {
        const site = this.litSiteEnCours();
        const action = type === 'commande'
            ? ApiAction.document.commande
            : type === 'livraison'
                ? ApiAction.document.livraison
                : ApiAction.document.facture;
        const params: { [param: string]: string } = {
            uid: keyClient.uid,
            rno: '' + keyClient.rno,
            no: '' + no,
        };
        const lecture$: Observable<ApiDocsAvecTarifEtClient> = this.lectureObs<ApiDocsAvecTarifEtClient>({
            demandeApi: () => this.get<ApiDocs>(ApiController.document, action, params),
        });
        return lecture$.pipe(
            concatMap(apiDocs => {
                const clfDocs = new CLFDocs();
                clfDocs.site = site;
                clfDocs.type = type;
                clfDocs.apiDocs = apiDocs.apiDocs;
                clfDocs.tarif = apiDocs.tarif;
                clfDocs.client = apiDocs.client;
                return this.catalogueService.catalogue$().pipe(
                    map(catalogue => {
                        clfDocs.fixeCatalogue(catalogue);
                        return clfDocs;
                    })
                );
            })
        );
    }

    /**
     * Cherche un document de type livraison ou facture à partir de son type et de son no.
     * @param param contient le no et le type du document cherché
     * @returns un ApiResultOk contenant un CLFChercheDoc avec la key et le nom du client et la date ou null
     */
    chercheDoc(param: { no: number, type: TypeCLF }): Observable<ApiResult> {
        if (param.type === 'commande') {
            throw new Error('docExiste: type commande');
        }
        const site = this.litSiteEnCours();
        const controller = ApiController.document;
        const action = ApiAction.document.cherche;
        const params: { [param: string]: string } = {
            uid: site.uid,
            rno: '' + site.rno,
            no: '' + param.no,
            type: param.type
        };
        return this.get(controller, action, params);
    }

    /**
     * Le ApiDocs retourné par l'Api contient les résumés des documents envoyés à l'utilisateur
     * depuis sa dernière déconnection (bons de commande pour les sites dont l'utilisateur est fournisseur,
     * bons de livraison et factures pour les sites dont l'utilisateur est client).
     */
    nouveaux(): Observable<ApiResult> {
        const controller = ApiController.document;
        const action = ApiAction.document.nouveaux;
        return this.get(controller, action);
    }

}
