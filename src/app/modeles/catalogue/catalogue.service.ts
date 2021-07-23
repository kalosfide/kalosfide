import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Catalogue, CatalogueApi } from './catalogue';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { DataService } from '../../services/data.service';
import { ApiController, ApiAction } from 'src/app/api/api-route';
import { EtatsProduits } from './etat-produit';
import { Site } from '../site/site';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { SiteService } from '../site/site.service';
import { IdEtatSite } from '../etat-site';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService extends DataService {

    controllerUrl = ApiController.catalogue;

    private stockage: Stockage<Catalogue>;

    constructor(
        protected apiRequeteService: ApiRequêteService,
        stockageService: StockageService,
        private siteService: SiteService,
    ) {
        super(apiRequeteService);
        this.stockage = stockageService.nouveau<Catalogue>('Catalogue', {
            // Le stockage sera réinitialisé à chaque changement de site ou d'identifiant
            rafraichi: true
        });
    }

    /**
     * Retourne un catalogue ne contenant que les produits disponibles du catalogue initial et leurs catégories.
     */
    private réduitAuxDisponibles(stock: Catalogue): Catalogue {
        if (!stock.avecIndisponibles) {
            return stock;
        }
        stock = Catalogue.filtre(stock, p => p.etat === EtatsProduits.disponible.valeur);
        stock.avecIndisponibles = false;
        return stock;
    }

    litStockSiExistant(): Catalogue {
        return this.stockage.litStock();
    }

    litStock(): Catalogue {
        const stock = this.litStockSiExistant();
        if (!stock) {
            throw new Error('Catalogue: Pas de stock');
        }
        return stock;
    }

    fixeStock(stock: Catalogue) {
        this.stockage.fixeStock(stock);
    }

    /**
     * Retourne le catalogue complet si @param avecIndisponibles n'est pas false
     */
    private _catalogue$(site: Site, avecIndisponibles: boolean): Observable<Catalogue> {
        const stock = this.litStockSiExistant();
        if (!stock // pas de stock
            || (avecIndisponibles && !stock.avecIndisponibles) // les indisponibles sont demandés mais pas en stock
        ) {
            const apiAction = avecIndisponibles ? ApiAction.catalogue.complet : ApiAction.catalogue.disponible;
            const demandeApi = () => this.get<CatalogueApi>(ApiController.catalogue, apiAction, KeyUidRno.créeParams(site));
            return this.lectureObs<CatalogueApi>({ demandeApi }).pipe(
                map(catalogueApi => {
                    const catalogue: Catalogue = Catalogue.nouveau(catalogueApi);
                    catalogue.avecIndisponibles = avecIndisponibles;
                    this.stockage.fixeStock(catalogue);
                    return catalogue;
                }));
        }
        if (!avecIndisponibles && stock.avecIndisponibles) {
            return of(this.réduitAuxDisponibles(stock));
        }
        return of(stock);
    }

    /**
     * Retourne le catalogue complet si l'utilisateur est le fournisseur
     */
    catalogue$(): Observable<Catalogue> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const avecIndisponibles = identifiant.estFournisseur(site);
        return this._catalogue$(site, avecIndisponibles);
    }

    disponiblesAvecPrixDatés(site: Site, tarifs: CatalogueApi[]): Observable<Catalogue> {
        return this._catalogue$(site, false).pipe(
            tap(catalogue => {
                catalogue.prixDatés = Catalogue.prixDatés(tarifs);
            })
        );
    }

    // ACTIONS
    commenceModification(site: Site): Observable<ApiResult> {
        return this.post(ApiController.catalogue, ApiAction.catalogue.commence, null, KeyUidRno.créeParams(site));
    }
    commenceModificationOk(site: Site) {
        this.siteService.changeEtatOk(site, IdEtatSite.catalogue);
    }

    termineModification(site: Site): Observable<ApiResult> {
        return this.post(ApiController.catalogue, ApiAction.catalogue.termine, null, KeyUidRno.créeParams(site));
    }
    termineModificationOk(site: Site) {
        this.siteService.changeEtatOk(site, IdEtatSite.ouvert);
    }

    private actionModification(
        apiAction: string,
        étatCatalogue: IdEtatSite,
        titre: string,
        infos: KfEtiquette[]
    ): Observable<boolean> {
        const site = this.navigation.litSiteEnCours();
        const modal = Fabrique.infoModal(titre, infos);
        return this.actionObs({
            demandeApi: () => this.post(ApiController.catalogue, apiAction, null, KeyUidRno.créeParams(site)),
            actionSiOk: () => this.siteService.changeEtatOk(site, étatCatalogue)
        }).pipe(
            concatMap((ok: boolean) => {
                if (ok) {
                    return this.modalService.confirme(modal);
                }
                return of(false);
            })
        )
    }
    commence(): Observable<boolean> {
        const titre = 'Modification du catalogue';
        const infos: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        étiquette = Fabrique.ajouteEtiquetteP(infos);
        étiquette.ajouteTextes(
            `Pendant la modification du catalogue`,
            { texte: `votre site est fermé`, balise: KfTypeDeBaliseHTML.b },
            `et vos clients ne peuvent pas commander.`
        );
        étiquette = Fabrique.ajouteEtiquetteP(infos);
        étiquette.ajouteTextes(
            `Il faut quitter les pages du catalogue ou vous déconnecter pour réouvrir votre site.`
        );
        const modal = Fabrique.infoModal(titre, infos);
        return this.actionModification(ApiAction.catalogue.commence, IdEtatSite.catalogue, titre, infos)
    }
}
