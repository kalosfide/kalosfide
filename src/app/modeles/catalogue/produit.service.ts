import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiController, ApiAction } from '../../api/api-route';
import { Produit } from './produit';
import { CatalogueService } from './catalogue.service';
import { Catalogue } from './catalogue';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { ProduitUtile } from './produit-utile';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { KfVueTableRéglages } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-reglages';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { SiteBilanCatalogue } from '../site/site-bilan';
import { KeyIdService } from 'src/app/commun/data-par-key/key-id/key-id.service';


@Injectable({
    providedIn: 'root'
})
export class ProduitService extends KeyIdService<Produit> {

    controllerUrl = ApiController.produit;

    constructor(
        private catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(stockageService, apiRequeteService);
        this.créeUtile();
    }

    protected _créeUtile() {
        this.pUtile = new ProduitUtile(this);
    }

    get utile(): ProduitUtile {
        return this.pUtile as ProduitUtile;
    }

    catalogue$(): Observable<Catalogue> {
        return this.catalogueService.catalogue$();
    }

    litProduits(): Produit[] {
        const stock = this.catalogueService.litStock();
        return stock.produits;
    }
    litProduit(id: number): Produit {
        const stock = this.catalogueService.litStock();
        return stock.produits.find(p => p.id === id);
    }

    nomPris(nom: string): boolean {
        const stock = this.catalogueService.litStock();
        return !!stock.produits.find(s => s.nom === nom);
    }

    nomPrisParAutre(id: number, nom: string): boolean {
        const stock = this.catalogueService.litStock();
        return !!stock.produits.find(s => s.nom === nom && s.id !== id);
    }

    private bilanCatalogue(stock: Catalogue): SiteBilanCatalogue {
        const disponibles = Catalogue.filtre(stock, p => p.disponible === true);
        return {
            produits: disponibles.produits.length,
            catégories: disponibles.catégories.length
        }
    }

    quandAjoute(ajouté: Produit) {
        const stock = this.catalogueService.litStock();
        stock.produits.push(ajouté);
        this.catalogueService.fixeStock(stock);
        this.identification.fixeSiteBilanCatalogue(this.bilanCatalogue(stock));
    }

    quandEdite(édité: Produit) {
        const stock = this.catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.id === édité.id);
        if (index === -1) {
            throw new Error('Produits: édité absent du stock');
        }
        const stocké = stock.produits[index];
        Produit.copieData(édité, stocké);
        this.catalogueService.fixeStock(stock);
        this.identification.fixeSiteBilanCatalogue(this.bilanCatalogue(stock));
    }

    apiRequêteSupprime(àSupprimer: Produit, quandSupprimé: (index: number, aprésSuppression: Catalogue) => void): ApiRequêteAction {
        return {
            demandeApi: () => this.supprime(àSupprimer),
            actionSiOk: (créé: any) => {
                const stock = this.catalogueService.litStock();
                const index = stock.produits.findIndex(s => s.id === àSupprimer.id);
                if (index === -1) {
                    throw new Error('Produits: supprimé absent du stock');
                }
                stock.produits.splice(index, 1);
                quandSupprimé(index, stock);
                this.catalogueService.fixeStock(stock);
                this.identification.fixeSiteBilanCatalogue(this.bilanCatalogue(stock));
            }
        };
    }

    prix(produit: Produit): Observable<ApiResult> {
        const produitPrix = {
            id: produit.id,
            prix: produit.prix
        };
        return this.put(ApiController.produit, ApiAction.produit.edite, produitPrix);
    }

    prixOk(produit: Produit) {
        const stock = this.catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.id === produit.id);
        if (index === -1) {
            throw new Error('Produits: prix absent du stock');
        }
        const stocké = stock.produits[index];
        stocké.prix = produit.prix;
        this.catalogueService.fixeStock(stock);
    }

    etat(produit: Produit): Observable<ApiResult> {
        const produitEtat = {
            id: produit.id,
            disponible: produit.disponible
        };
        return this.put(ApiController.produit, ApiAction.produit.edite, produitEtat);
    }

    etatOk(produit: Produit) {
        const stock = this.catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.id === produit.id);
        if (index === -1) {
            throw new Error('Produits: etat absent du stock');
        }
        const stocké = stock.produits[index];
        stocké.disponible = produit.disponible;
        this.catalogueService.fixeStock(stock);
    }

    get réglagesVueTable(): KfVueTableRéglages {
        return this.catalogueService.litRéglagesVueTable('produit')
    }

    set réglagesVueTable(réglages: KfVueTableRéglages) {
        this.catalogueService.fixeRéglagesVueTable('produit', réglages);
    }

}
