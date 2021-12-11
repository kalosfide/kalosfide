import { Injectable } from '@angular/core';
import { ApiController } from '../../api/api-route';
import { Categorie } from './categorie';
import { KeyUidRnoNoService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { CatalogueService } from './catalogue.service';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { CatalogueUtile } from './catalogue-utile';
import { CategorieUtile } from './categorie-utile';
import { Observable } from 'rxjs';
import { Catalogue } from './catalogue';
import { map, switchMap } from 'rxjs/operators';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { KfVueTableRéglages } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-reglages';
import { StockageService } from 'src/app/services/stockage/stockage.service';


@Injectable({
    providedIn: 'root'
})
export class CategorieService extends KeyUidRnoNoService<Categorie> {

    controllerUrl = ApiController.categorie;

    constructor(
        private catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(stockageService, apiRequeteService);
        this.créeUtile();
    }

    protected _créeUtile() {
        this.pUtile = new CategorieUtile(this);
    }

    get utile(): CategorieUtile {
        return this.pUtile as CategorieUtile;
    }

    catégories$(): Observable<Categorie[]> {
        return this.catalogueService.catalogue$().pipe(
            map((catalogue: Catalogue) => {
                catalogue.catégories.forEach(c => c.nbProduits = catalogue.produits.filter(p => p.categorieNo === c.no).length);
                return catalogue.catégories;
            })
        );
    }

    catégorie$(no: number): Observable<Categorie> {
        return this.catalogueService.catalogue$().pipe(
            map((catalogue: Catalogue) => catalogue.catégories.find(c => c.no === no))
        );
    }

    litCatégories(): Categorie[] {
        const stock = this.catalogueService.litStock();
        return stock.catégories;
    }
    litCatégorie(no: number): Categorie {
        const stock = this.catalogueService.litStock();
        return stock.catégories.find(c => c.no === no);
    }

    nomPris(nom: string): boolean {
        const stock = this.catalogueService.litStock();
        return !!stock.catégories.find(s => s.nom === nom);
    }

    nomPrisParAutre(no: number, nom: string): boolean {
        const stock = this.catalogueService.litStock();
        return !!stock.catégories.find(s => s.nom === nom && s.no !== no);
    }

    quandAjoute(ajouté: Categorie) {
        const stock = this.catalogueService.litStock();
        stock.catégories.push(ajouté);
        this.catalogueService.fixeStock(stock);
    }

    quandEdite(édité: Categorie) {
        const stock = this.catalogueService.litStock();
        const index = stock.catégories.findIndex(s => s.no === édité.no);
        if (index === -1) {
            throw new Error('Catégories: édité absent du stock');
        }
        stock.catégories[index].copieData(édité);
        this.catalogueService.fixeStock(stock);
    }

    apiRequêteSupprime(àSupprimer: Categorie, quandSupprimé: (index: number, aprésSuppression: Catalogue) => void): ApiRequêteAction {
        return {
            demandeApi: () => this.supprime(àSupprimer),
            actionSiOk: (créé: any) => {
                const stock = this.catalogueService.litStock();
                const index = stock.catégories.findIndex(s => s.no === àSupprimer.no);
                if (index === -1) {
                    throw new Error('Catégories: supprimé absent du stock');
                }
                stock.catégories.splice(index, 1);
                quandSupprimé(index, stock);
                this.catalogueService.fixeStock(stock);
            }
        }
    }
    
    get réglagesVueTable(): KfVueTableRéglages {
        return this.catalogueService.litRéglagesVueTable('categorie')
    }

    set réglagesVueTable(réglages: KfVueTableRéglages) {
        this.catalogueService.fixeRéglagesVueTable('categorie', réglages);
    }

}
