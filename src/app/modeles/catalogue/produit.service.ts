import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiController, ApiAction } from '../../api/api-route';
import { Produit } from './produit';
import { KeyUidRnoNoService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { EtatProduit, EtatsProduits, IdEtatProduit } from './etat-produit';
import { CatalogueService } from './catalogue.service';
import { Catalogue } from './catalogue';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { ProduitUtile } from './produit-utile';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { KfVueTableRéglages } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-reglages';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { SiteBilanCatalogue } from '../site/site-bilan';


@Injectable({
    providedIn: 'root'
})
export class ProduitService extends KeyUidRnoNoService<Produit> {

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
    litProduit(no: number): Produit {
        const stock = this.catalogueService.litStock();
        return stock.produits.find(p => p.no === no);
    }

    nomPris(nom: string): boolean {
        const stock = this.catalogueService.litStock();
        return !!stock.produits.find(s => s.nom === nom);
    }

    nomPrisParAutre(no: number, nom: string): boolean {
        const stock = this.catalogueService.litStock();
        return !!stock.produits.find(s => s.nom === nom && s.no !== no);
    }

    private bilanCatalogue(stock: Catalogue): SiteBilanCatalogue {
        const disponibles = Catalogue.filtre(stock, p => p.etat === IdEtatProduit.disponible);
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
        const index = stock.produits.findIndex(s => s.no === édité.no);
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
                const index = stock.produits.findIndex(s => s.no === àSupprimer.no);
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
            uid: produit.uid,
            rno: produit.rno,
            no: produit.no,
            prix: produit.prix
        };
        return this.put(ApiController.produit, ApiAction.produit.edite, produitPrix);
    }

    prixOk(produit: Produit) {
        const stock = this.catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.no === produit.no);
        if (index === -1) {
            throw new Error('Produits: prix absent du stock');
        }
        const stocké = stock.produits[index];
        stocké.prix = produit.prix;
        this.catalogueService.fixeStock(stock);
    }

    etat(produit: Produit): Observable<ApiResult> {
        const produitEtat = {
            uid: produit.uid,
            rno: produit.rno,
            no: produit.no,
            etat: produit.etat
        };
        return this.put(ApiController.produit, ApiAction.produit.edite, produitEtat);
    }

    etatOk(produit: Produit) {
        const stock = this.catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.no === produit.no);
        if (index === -1) {
            throw new Error('Produits: etat absent du stock');
        }
        const stocké = stock.produits[index];
        stocké.etat = produit.etat;
        this.catalogueService.fixeStock(stock);
    }

    get réglagesVueTable(): KfVueTableRéglages {
        return this.catalogueService.litRéglagesVueTable('produit')
    }

    set réglagesVueTable(réglages: KfVueTableRéglages) {
        this.catalogueService.fixeRéglagesVueTable('produit', réglages);
    }

}
