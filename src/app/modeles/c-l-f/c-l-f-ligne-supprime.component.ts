import { OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { Site } from '../site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Produit } from '../catalogue/produit';
import { Client } from '../client/client';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { RouteurService } from 'src/app/services/routeur.service';
import { CLFLigne } from './c-l-f-ligne';
import { CLFUtile } from './c-l-f-utile';
import { CLFService } from './c-l-f.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';
import { DataService } from 'src/app/services/data.service';
import { CLFDoc } from './c-l-f-doc';
import { ModalComponent, IModalComponentDef } from 'src/app/disposition/modal/modal.component';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';

export abstract class CLFLigneSupprimeComponent extends ModalComponent implements OnInit, OnDestroy, IDataKeyComponent {

    site: Site;
    identifiant: Identifiant;

    private pLigne: CLFLigne;


    get utile(): CLFUtile {
        return this.service.utile;
    }

    get produit(): Produit { return this.pLigne.produit; }
    get client(): Client { return this.pLigne.client; }

    get clfDoc(): CLFDoc {
        return this.pLigne.parent;
    }

    get titre(): string {
        return !this.clfDoc.synthèse
            ? this.pageDef.titre
            : `${this.service.utile.texte.textes(this.clfDoc.synthèse.type).def.Bon}${this.clfDoc.no !== 0
                ? ' n° ' + this.clfDoc.no
                : ' virtuel'}${this.pageDef.titre ? ' - ' + this.pageDef.titre : ''}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get iservice(): DataService {
        return this.service;
    }

    get routeur(): RouteurService { return this.service.routeur; }

    créeDef(data: Data): IModalComponentDef {
        this.pLigne = data.clfLigne;
        this.service.utile.url.fixeRouteDoc(this.pLigne.parent);
        const titre = `Suppression d'une ligne`;
        const texteUtile = this.utile.texte.textes(this.pLigne.parent.type);
        const description = new KfEtiquette('');
        description.baliseHtml = KfTypeDeBaliseHTML.p;
        Fabrique.ajouteTexte(description,
            `La ${texteUtile.def.action} de `,
            {
                texte: `${this.pLigne.no === 0
                    ? Fabrique.texte.quantitéAvecUnité(this.produit, this.pLigne.quantité, this.pLigne.typeCommande)
                    : Fabrique.texte.quantitéAvecUnité(this.produit, this.pLigne.aFixer, this.pLigne.typeCommande)
                    }`,
                balise: KfTypeDeBaliseHTML.b
            },
            ' de ',
            {
                texte: `${this.produit.nom}`,
                balise: KfTypeDeBaliseHTML.b
            },
            ' au prix de ',
            {
                texte: Fabrique.texte.prixAvecUnité(this.produit.typeMesure, this.pLigne.prix),
                balise: KfTypeDeBaliseHTML.b
            },
            ' va être supprimée.'
        );
        const corps = new KfGroupe('');
        corps.ajoute(description);
        const defAnnuler: IBoutonDef = {
            nom: 'annuler',
            contenu: { texte: 'Annuler'},
            action: (() => this.routeur.navigueUrlDef(this.utile.url.retourLigne(this.pLigne))).bind(this)
        };

        const apiRequêteAction: ApiRequêteAction = {
            demandeApi: () => this.service.supprimeLigne(this.pLigne),
            actionSiOk: ((): void => {
                this.service.siSupprimeLigneOk(this.pLigne);
                this.routeur.navigueUrlDef(this.utile.lien.url.bon());
            }).bind(this),
        };
        const defSupprime: IBoutonDef = {
            nom: 'supprime',
            contenu: { texte: 'Supprimer' },
            action: () => {
                const subscription = this.service.actionOkObs(apiRequêteAction).subscribe(() => { subscription.unsubscribe(); });
            }
        };
        return {
            titre,
            corps,
            urlSiPasAction: this.utile.url.retourLigne(this.pLigne),
            boutonDefs: [defAnnuler, defSupprime]
        };
    }
}
