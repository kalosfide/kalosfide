import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { Observable, of, Subject } from 'rxjs';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { Site } from '../site/site';
import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
import { ApiDocument } from './api-document';
import { CatalogueService } from '../catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Stockage } from 'src/app/services/stockage/stockage';
import { CLFDocs } from './c-l-f-docs';
import { map, tap, mergeMap, concatMap } from 'rxjs/operators';
import { ApiDocumentsData } from './api-documents-client-data';
import { ApiController, ApiAction } from 'src/app/api/api-route';
import { ClientService } from '../client/client.service';
import { TypeCLF } from './c-l-f-type';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { CLFBilan } from './c-l-f-bilan';
import { CLFFiltre } from './c-l-f-filtre';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { CLFDoc } from './c-l-f-doc';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';

export abstract class CLFLectureService extends KeyUidRnoNoService<ApiDocument> {

    private pStockage: Stockage<CLFDocs>;

    private pClsBilanIO?: ValeurEtObservable<CLFBilan>;

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
        super(apiRequeteService);
        this.pStockage = stockageService.nouveau<CLFDocs>(nomStockage, {
            // Le stockage sera réinitialisé à chaque changement de site ou d'identifiant
            rafraichi: true,
        });
        this.pClsBilanIO = ValeurEtObservable.nouveau(CLFBilan.bilanVide());
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

    get clsBilanIO(): ValeurEtObservable<CLFBilan> {
        return this.pClsBilanIO;
    }

    /**
     * Retourne un CLFDocs avec méthodes créé en copiant le stock si le stock existe
     */
    litStockSiExistant(): CLFDocs {
        const stocké = this.pStockage.litStock();
        if (stocké) {
            const stock = new CLFDocs();
            stock.copie(stocké);
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
        if (stock.type !== 'commande' && !stock.estContexte) {
            stock.créeBilan();
        }
        this.pStockage.fixeStock(stock);
        if (stock.type !== 'commande') {
            // L'observable du bilan émet si le bilan a changé
            this.pClsBilanIO.changeValeur(stock.clfBilan);
        }
    }

    videStock() {
        this.pStockage.vide();

    }

    // Lectures de CLFDocs

    /**
     * Le CLFDocs lu dans l'Api.
     * Pas stocké.
     */
    protected _clfDocs$(site: Site, controller: string, action: string, params: { [param: string]: string }): Observable<CLFDocs> {
        const clfDocs$: Observable<CLFDocs> = this.lectureObs<ApiDocumentsData>({
            demandeApi: () => this.get<ApiDocumentsData>(controller, action, params),
        }).pipe(
            map(datas => {
                const clfDocs = new CLFDocs();
                clfDocs.site = site;
                clfDocs.charge(datas);
                return clfDocs;
            })
        );
        return clfDocs$;
    }

    get filtre(): CLFFiltre {
        return this.pFiltre;
    }

    détruitFiltre() {
        this.pFiltre = undefined;
    }

    /**
     * Pour le client, le CLFDocs lu dans l'Api contient les listes des résumés des documents du client avec leur type
     * et le CLFDocs retourné contient le Client du client.
     * Pour le fournisseur, le CLFDocs lu dans l'Api contient les listes des résumés des documents de tous les clients avec leur type
     * et le CLFDocs retourné contient les Client de tous les clients.
     * Pas stocké.
     */
    abstract documents(): Observable<CLFDocs>;

    /**
     * Pour le client et le fournisseur.
     * Le CLFDocs lu dans l'Api contient le document avec les lignes et le Client du client.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * @param keyDocument key du document
     * @param type type du document
     * Pas stocké.
     */
    document(keyDocument: IKeyUidRnoNo, type: TypeCLF): Observable<CLFDocs> {
        const site = this.navigation.litSiteEnCours();
        const controller = ApiController.document;
        const action = type === 'commande'
            ? ApiAction.document.commande
            : type === 'livraison'
                ? ApiAction.document.livraison
                : ApiAction.document.facture;
        const params: { [param: string]: string } = {
            uid: keyDocument.uid,
            rno: '' + keyDocument.rno,
            no: '' + keyDocument.no,
        };
        return this._clfDocs$(site, controller, action, params).pipe(
            concatMap(clfDocs => {
                clfDocs.type = type;
                const tarifs = clfDocs.documents.filter(d => !!d.tarif).map(d => d.tarif);
                return this.catalogueService.disponiblesAvecPrixDatés(site, tarifs).pipe(
                    map(catalogue => {
                        clfDocs.catalogue = catalogue;
                        this.fixeStock(clfDocs);
                        return clfDocs;
                    })
                );
            })
        );
    }

}
