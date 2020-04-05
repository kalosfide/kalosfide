import { ProduitService } from './produit.service';
import { DataKeyUtile } from 'src/app/commun/data-par-key/data-key-utile';
import { Produit } from './produit';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { ProduitRoutes, ProduitPages } from 'src/app/fournisseur/catalogue/produits/produit-pages';
import { ProduitUtileUrl } from './produit-utile-url';
import { ProduitUtileLien } from './produit-utile-lien';
import { ProduitUtileColonne } from './produit-utile-colonne';
import { ProduitUtileBouton } from './produit-utile-bouton';
import { ProduitUtileOutils } from './produit-utile-outils';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';

export class ProduitUtile extends DataKeyUtile<Produit> {
    constructor(service: ProduitService) {
        super(service);
        this.dataRoutes = ProduitRoutes;
        this.dataPages = ProduitPages;
        this.pUrl = new ProduitUtileUrl(this);
        this.pLien = new ProduitUtileLien(this);
        this.pBouton = new ProduitUtileBouton(this);
        this.pOutils = new ProduitUtileOutils(this);
        this.pColonne = new ProduitUtileColonne(this);
        this.pUrlKey = new DataKeyUtileUrl(this);
        this.pLienKey = new DataKeyUtileLien(this);
        this.pColonneKey = new DataKeyUtileColonne(this);
        this.pOutilsKey = new DataKeyUtileOutils(this);
    }

    get service(): ProduitService {
        return this.pService as ProduitService;
    }

    get url(): ProduitUtileUrl {
        return this.pUrl as ProduitUtileUrl;
    }

    get lien(): ProduitUtileLien {
        return this.pLien as ProduitUtileLien;
    }

    get bouton(): ProduitUtileBouton {
        return this.pBouton as ProduitUtileBouton;
    }

    get outils(): ProduitUtileOutils {
        return this.pOutils as ProduitUtileOutils;
    }

    get colonne(): ProduitUtileColonne {
        return this.pColonne as ProduitUtileColonne;
    }
}
