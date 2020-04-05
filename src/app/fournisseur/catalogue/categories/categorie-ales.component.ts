import { ActivatedRoute } from '@angular/router';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { OnInit } from '@angular/core';
import { Site } from 'src/app/modeles/site/site';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';
import { CategorieEditeur } from '../../../modeles/catalogue/categorie-editeur';
import { KeyUidRnoNoALESComponent } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-ales.component';

export abstract class CategorieALESComponent extends KeyUidRnoNoALESComponent<Categorie> implements OnInit {

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    constructor(
        protected route: ActivatedRoute,
        protected service: CategorieService,
    ) {
        super(route, service);
    }

    get categorie(): Categorie {
        return this.valeur;
    }

    créeDataEditeur()  {
        this.dataEditeur = new CategorieEditeur(this);
    }

}
