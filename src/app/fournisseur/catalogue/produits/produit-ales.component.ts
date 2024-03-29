import { ActivatedRoute, Data } from '@angular/router';

import { ProduitPages } from './produit-pages';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Component, OnInit } from '@angular/core';
import { Site } from 'src/app/modeles/site/site';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { ProduitEditeur } from 'src/app/modeles/catalogue/produit-editeur';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KeyIdALESComponent } from 'src/app/commun/data-par-key/key-id/key-id-ales.component';

@Component({ template: '' })
export abstract class ProduitALESComponent extends KeyIdALESComponent<Produit> implements OnInit {

    site: Site;

    /**
     * pour permettre de lancer un avertissement quand le nombre de produits disponibles est nul
     */
    produitChargéDisponible: boolean;

    dataPages = ProduitPages;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);
        this.chargeData = (data: Data) => this.editeur.chargeData(data);
    }

    protected contenuAidePage = (): KfComposant[] => {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    get produit(): Produit {
        return this.valeur;
    }

    créeDataEditeur() {
        this.dataEditeur = new ProduitEditeur(this);
    }

    get editeur(): ProduitEditeur {
        return this.dataEditeur as ProduitEditeur;
    }

    fixeValeur(valeur: Produit) {
        this.dataEditeur.fixeValeur(valeur);
        this.produitChargéDisponible = valeur && valeur.disponible === true;
    }

}
