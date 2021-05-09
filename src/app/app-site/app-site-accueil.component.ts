import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { AppSitePages } from './app-site-pages';
import { BarreTitre } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { Identifiant } from '../securite/identifiant';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { AppSite } from './app-site';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { ILienDef } from '../disposition/fabrique/fabrique-lien';
import { CompteRoutes, ComptePages } from '../compte/compte-pages';
import { IdentificationService } from '../securite/identification.service';
import { FournisseurRoutes } from '../fournisseur/fournisseur-pages';
import { ClientRoutes } from '../client/client-pages';
import { KfUlComposant } from '../commun/kf-composants/kf-ul/kf-ul-composant';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSiteAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef = AppSitePages.accueil;
    identifiant: Identifiant;

    get titre(): string {
        return this.pageDef.titre;
    }

    constructor(
        private identification: IdentificationService,
    ) {
        super();
    }

    créePrésentation(): KfGroupe {
        const groupe = new KfGroupe('presentation');
        const textes: KfEtiquette[] = [];
        Fabrique.ajouteTexte(Fabrique.ajouteEtiquetteP(textes),
            `${AppSite.titre} permet à des fournisseurs de gérer dans leur site personnel les bons de commandes qu'il reçoivent `
            + `et les bons de livraison et les factures qu'ils emettent.`);
        Fabrique.ajouteTexte(Fabrique.ajouteEtiquetteP(textes),
            `Après avoir ouvert son compte ${AppSite.titre}, un utilisateur peut créer son site et prendre ainsi un `,
            { texte: 'role de Fournisseur', balise: KfTypeDeBaliseHTML.b },
            `. Il peut alors y publier le catalogue de ses produits, gérer les données des ses bons de commandes, bons de livraison `
            + `et factures et télécharger ces documents. `
        );
        Fabrique.ajouteTexte(Fabrique.ajouteEtiquetteP(textes),
            `Après avoir ouvert son compte ${AppSite.titre}, un utilisateur peut prendre un `,
            { texte: 'role de Client', balise: KfTypeDeBaliseHTML.b },
            ` du site d'un Fournisseur. Il peut alors gérer les données des ses bons de commandes`
            + ` et télécharger ses bons de commandes, bons de livraison et factures.`
        );
        const ul = new KfUlComposant('');
        let li: KfEtiquette;
        li = new KfEtiquette('');
        Fabrique.ajouteTexte(li,
            `Créer `,
        );
        ul.ajoute(li);

        textes.forEach(t => groupe.ajoute(t));
        return groupe;
    }

    créeSansIdentifiant(): KfGroupe {
        const textes: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        let def: ILienDef;
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        Fabrique.ajouteTexte(étiquette,
            `Vous n'êtes pas connecté à ${AppSite.titre}.`
        );
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        Fabrique.ajouteTexte(étiquette,
            `Si vous avez un compte, vous pouvez `
        );
        def = {
            nom: 'connection',
            urlDef: {
                keys: CompteRoutes.route([ComptePages.connection.urlSegment]),
            },
            contenu: { texte: 'vous connecter' },
        };
        étiquette.contenuPhrase.ajoute(Fabrique.lien.lienEnLigne(def));
        Fabrique.ajouteTexte(étiquette, ` à ${AppSite.titre}.`);
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        Fabrique.ajouteTexte(étiquette,
            `Si vous n'avez pas de compte, vous pouvez `
        );
        def = {
            nom: 'ajout',
            urlDef: {
                keys: CompteRoutes.route([ComptePages.ajoute.urlSegment]),
            },
            contenu: { texte: 'créer votre compte' },
        };
        étiquette.contenuPhrase.ajoute(Fabrique.lien.lienEnLigne(def));
        Fabrique.ajouteTexte(étiquette, ` ${AppSite.titre}.`);

        const groupe = new KfGroupe('');
        textes.forEach(t => groupe.ajoute(t));

        return groupe;
    }

    créeAvecIdentifiant(): KfGroupe {
        const textes: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        Fabrique.ajouteTexte(étiquette,
            {
                texte: this.identifiant.userName,
                balise: KfTypeDeBaliseHTML.b
            },
            `, vous êtes connecté à ${AppSite.titre}.`
        );
        let possèdeUnSite = false;
        if (this.identifiant.roles.length === 0) {
            étiquette = Fabrique.ajouteEtiquetteP(textes);
            Fabrique.ajouteTexte(étiquette,
                `Vous n'avez pas de role actif sur ${AppSite.titre}. Vous n'êtes ni fournisseur ni client `
                + `d'un site.`
            );
        } else {
            this.identifiant.sites.forEach(site => {
                const estFournisseur = this.identifiant.estFournisseur(site);
                possèdeUnSite = possèdeUnSite || estFournisseur;
                étiquette = Fabrique.ajouteEtiquetteP(textes);
                Fabrique.ajouteTexte(étiquette,
                    `Vous êtes `,
                    estFournisseur ? 'le fournisseur propriétaire' : 'un client',
                    ' du site '
                );
                const def: ILienDef = {
                    nom: site.url,
                    urlDef: {
                        routes: estFournisseur ? FournisseurRoutes : ClientRoutes,
                        urlSite: site.url
                    },
                    contenu: { texte: site.titre },
                };
                const lien = Fabrique.lien.lienEnLigne(def);
                étiquette.contenuPhrase.ajoute(lien);
                Fabrique.ajouteTexte(étiquette,
                    ` d'adresse ${AppSite.urlSegment}/s/${site.url}`);
            });
        }
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        Fabrique.ajouteTexte(étiquette,
            `Vous pouvez créer ${possèdeUnSite ? 'un autre' : 'votre'} site et devenir Fournisseur en suivant ce lien `
        );
        const defDevenirFournisseur: ILienDef = {
            nom: 'devenirFournisseur',
            urlDef: {
                keys: [AppSitePages.devenirFournisseur.urlSegment],
            },
            contenu: { texte: 'Devenir Fournisseur' },
        };
        const devenirFournisseur = Fabrique.lien.lienEnLigne(defDevenirFournisseur);
        étiquette.contenuPhrase.ajoute(devenirFournisseur);
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        Fabrique.ajouteTexte(étiquette,
            `Pour devenir client d'un site, vous devez contacter physiquement le fournisseur du site `
            + `et suivre les instructions contenues dans le message qu'il vous enverra à l'adresse email `
            + `de votre compte ${AppSite.titre}.`
        );

        const groupe = new KfGroupe('');
        textes.forEach(t => groupe.ajoute(t));

        return groupe;
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(this.créePrésentation());
        if (this.identifiant) {
            this.superGroupe.ajoute(this.créeAvecIdentifiant());
        } else {
            this.superGroupe.ajoute(this.créeSansIdentifiant());
        }
    }

    ngOnInit() {
        this.identifiant = this.identification.litIdentifiant();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
    }
}
