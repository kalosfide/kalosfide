import { CategorieService } from './categorie.service';
import { DataKeyUtile } from 'src/app/commun/data-par-key/data-key-utile';
import { Categorie } from './categorie';
import { CategorieRoutes, CategoriePages } from 'src/app/fournisseur/catalogue/categories/categorie-pages';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { CategorieUtileUrl } from './categorie-utile-url';
import { CategorieUtileLien } from './categorie-utile-lien';
import { CategorieUtileBouton } from './categorie-utile-bouton';
import { CategorieUtileOutils } from './categorie-utile-outils';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { CategorieUtileColonne } from './categorie-utile-colonne';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';

export class CategorieUtile extends DataKeyUtile<Categorie> {
    constructor(service: CategorieService) {
        super(service);
        this.dataRoutes = CategorieRoutes;
        this.dataPages = CategoriePages;
        this.pUrl = new CategorieUtileUrl(this);
        this.pLien = new CategorieUtileLien(this);
        this.pBouton = new CategorieUtileBouton(this);
        this.pOutils = new CategorieUtileOutils(this);
        this.pColonne = new CategorieUtileColonne(this);
        this.pUrlKey = new DataKeyUtileUrl(this);
        this.pLienKey = new DataKeyUtileLien(this);
        this.pColonneKey = new DataKeyUtileColonne(this);
        this.pOutilsKey = new DataKeyUtileOutils(this);
    }

    get service(): CategorieService {
        return this.pService as CategorieService;
    }

    get url(): CategorieUtileUrl {
        return this.pUrl as CategorieUtileUrl;
    }

    get lien(): CategorieUtileLien {
        return this.pLien as CategorieUtileLien;
    }

    get bouton(): CategorieUtileBouton {
        return this.pBouton as CategorieUtileBouton;
    }

    get outils(): CategorieUtileOutils {
        return this.pOutils as CategorieUtileOutils;
    }

    get colonne(): CategorieUtileColonne {
        return this.pColonne as CategorieUtileColonne;
    }
}
