import { FournisseursPages } from 'src/app/admin/fournisseurs/fournisseurs-pages';
import { KeyUidRnoUtile } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Fournisseur } from './fournisseur';
import { FournisseurUtileBouton } from './fournisseur-utile-bouton';
import { FournisseurUtileColonne } from './fournisseur-utile-colonne';
import { FournisseurUtileLien } from './fournisseur-utile-lien';
import { FournisseurUtileOutils } from './fournisseur-utile-outils';
import { FournisseurUtileUrl } from './fournisseur-utile-url';
import { FournisseurService } from './fournisseur.service';

export class FournisseurUtile extends KeyUidRnoUtile<Fournisseur> {
    constructor(service: FournisseurService) {
        super(service);
        this.dataRouteur = Fabrique.url.appRouteur.admin.sites;
        this.dataPages = FournisseursPages;
        this.pUrl = new FournisseurUtileUrl(this);
        this.pLien = new FournisseurUtileLien(this);
        this.pBouton = new FournisseurUtileBouton(this);
        this.pOutils = new FournisseurUtileOutils(this);
        this.pColonne = new FournisseurUtileColonne(this);
    }

    get service(): FournisseurService {
        return this.pService as FournisseurService;
    }

    get url(): FournisseurUtileUrl {
        return this.pUrl as FournisseurUtileUrl;
    }

    get lien(): FournisseurUtileLien {
        return this.pLien as FournisseurUtileLien;
    }

    get bouton(): FournisseurUtileBouton {
        return this.pBouton as FournisseurUtileBouton;
    }

    get outils(): FournisseurUtileOutils {
        return this.pOutils as FournisseurUtileOutils;
    }

    get colonne(): FournisseurUtileColonne {
        return this.pColonne as FournisseurUtileColonne;
    }
}
