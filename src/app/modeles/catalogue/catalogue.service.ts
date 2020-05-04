import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Catalogue, CatalogueApi } from './catalogue';
import { map, take } from 'rxjs/operators';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { DataService } from '../../services/data.service';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { EtatsProduits } from './etat-produit';
import { Site } from '../site/site';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { SiteService } from '../site/site.service';
import { IdEtatSite } from '../etat-site';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { DATE_EST_NULLE, DATE_NULLE } from '../date-nulle';

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
        this.stockage = stockageService.nouveau<Catalogue>('Catalogue', { rafraichit: 'rafraichi' });
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

    litStock(): Catalogue {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Catalogue: Pas de stock');
        }
        return Catalogue.nouveau(stock);
    }

    fixeStock(stock: Catalogue) {
        this.stockage.fixeStock(stock);
    }

    /**
     * retourne le catalogue complet si l'identifiant est le fournisseur, des disponibles sinon
     */
    catalogue$(): Observable<Catalogue> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const avecIndisponibles = !!identifiant && identifiant.estFournisseur(site);
        const stock = this.stockage.litStock();
        if (!stock // pas de stock
            || (site.uid !== stock.uid || site.rno !== stock.rno) // site changé
            || (avecIndisponibles && !stock.avecIndisponibles)
        ) {
            const apiAction = avecIndisponibles ? ApiAction.catalogue.complet : ApiAction.catalogue.disponible;
            return this.objet<CatalogueApi>(this.get(ApiController.catalogue, apiAction, KeyUidRno.créeParams(site))).pipe(
                map(catalogueApi => {
                    const nouveauStock: Catalogue = Catalogue.nouveau(catalogueApi);
                    nouveauStock.avecIndisponibles = avecIndisponibles;
                    this.stockage.fixeStock(nouveauStock);
                    return nouveauStock;
                }));
        }
        if (!avecIndisponibles && stock.avecIndisponibles) {
            return of(this.réduitAuxDisponibles(stock));
        }
        return of(stock);
    }

    /**
     * Envoie à l'Api la key du site et, si le stock existe, la date du stock.
     * Si le stock n'existe pas ou est obsolète, l'Api retourne un CatalogueApi qui contient les données du catalogue à jour.
     * Si le stock existe et n'est pas obsolète, l'Api retourne un CatalogueApi vide
     * Si le site est d'état Catalogue, le CatalogueApi retourné à une date égale à DATE_NULLE.
     *
     * Si le stock n'existe pas ou est obsolète, crée le Catalogue à jour, fixe le stock et retourne
     * un Catalogue avec prix anciens créé à partir du stock et du @param anciens.
     * Si le stock existe et n'est pas obsolète et si @param catalogue est présent, retourne un Catalogue vide.
     * Si le stock existe et n'est pas obsolète et si @param catalogue est absent, retourne
     * un Catalogue avec prix anciens créé à partir du stock et du @param anciens.
     * Si le site est d'état Catalogue, le Catalogue retourné à une date égale à DATE_NULLE.
     * @param keySite key du site
     * @param anciens prix anciens à ajouter au catalogue en cours
     * @param catalogue si présent, est identique au catalogue stocké
     */
    cataloguePlusRécentQue$(keySite: IKeyUidRno, anciens: CatalogueApi[], catalogue?: Catalogue): Observable<Catalogue> {
        let stock = this.stockage.litStock();
        const params: { [param: string]: string } = {
            uid: keySite.uid,
            rno: '' + keySite.rno,
        };
        if (stock) {
            const date = new Date(stock.date);
            params.date = date.toJSON();
        }
        return this.objet<CatalogueApi>(this.get(ApiController.catalogue, ApiAction.catalogue.obsolete, params)).pipe(
            take(1),
            map(catalogueApi => {
                if (catalogueApi.produits) {
                    // le stock n'existe pas ou est obsolète
                    stock = Catalogue.nouveau(catalogueApi);
                    this.stockage.fixeStock(stock);
                    catalogue = undefined;
                }
                let nouveau: Catalogue;
                if (!catalogue) {
                    // le catalogue n'existait pas ou est obsolète
                    nouveau = stock;
                    nouveau.prixDatés = Catalogue.prixDatés(anciens);
                } else {
                    nouveau = new Catalogue();
                }
                if (DATE_EST_NULLE(catalogueApi.date)) {
                    // le site est d'état Catalogue
                    nouveau.date = DATE_NULLE;
                }
                return nouveau;
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
}
