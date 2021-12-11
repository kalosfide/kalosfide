import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Catalogue, CatalogueApi } from './catalogue';
import { concatMap, map } from 'rxjs/operators';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { DataService } from '../../services/data.service';
import { ApiController, ApiAction } from 'src/app/api/api-route';
import { EtatsProduits, IdEtatProduit } from './etat-produit';
import { Site } from '../site/site';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { SiteService } from '../site/site.service';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { ContexteCatalogue } from 'src/app/client/contexte-catalogue';
import { Role } from '../role/role';
import { SiteBilanCatalogue } from '../site/site-bilan';

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
        super(stockageService, apiRequeteService);
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
                    const catalogue: Catalogue = Catalogue.nouveau(site, catalogueApi);
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
        const role = this.identification.roleEnCours;
        const avecIndisponibles = role.estFournisseur
        return this._catalogue$(role.site, avecIndisponibles);
    }

    /**
     * Lit dans l'Api l'état du site en cours et si changé, met à jour les stockage du site et le site passé en paramètre.
     * @param site ce paramètre est modifié si besoin pour refléter le site de l'Api.
     */
    public contexteChangé(site: Site): Observable<boolean> {
        const demandeApi = () => this.get<ContexteCatalogue>(this.controllerUrl, ApiAction.catalogue.etat, KeyUidRno.créeParams(site));
        return this.lectureObs<ContexteCatalogue>({ demandeApi }).pipe(
            map(contexte => {
                // la date de l'état du site n'existe pas avant le premier appel a contexteChangé
                const initial = !site.dateCatalogue;
                if (!Site.ontMêmeEtat(site, contexte)) {
                    Site.copieEtat(contexte, site);
                    this.identification.fixeSite(site);
                    return true;
                }
                return false;
            })
        );
    }

    // ACTIONS

    apiRequêteAction(site: Site, apiAction: string, ouvert: boolean): ApiRequêteAction {
        const params = KeyUidRno.créeParams(site);
        return {
            demandeApi: () => this.post(ApiController.catalogue, apiAction, null, params),
            actionSiOk: (créé: any) => {
                site.ouvert = ouvert;
                site.dateCatalogue = créé.date;
                this.identification.fixeSite(site);
            }
        };
    }

    commenceModification(site: Site): ApiRequêteAction {
        return this.apiRequêteAction(site, ApiAction.catalogue.commence, false);
    }

    termineModification(site: Site): ApiRequêteAction {
        return this.apiRequêteAction(site, ApiAction.catalogue.termine, true);
    }

    private actionModification(
        apiAction: string,
        ouvert: boolean,
        titre: string,
        infos: KfEtiquette[]
    ): Observable<boolean> {
        const site = this.identification.siteEnCours;
        const modal = Fabrique.infoModal(titre, infos, 'success');
        return this.actionObs(this.apiRequêteAction(site, apiAction, ouvert)).pipe(
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
        return this.actionModification(ApiAction.catalogue.commence, false, titre, infos)

    }
}
