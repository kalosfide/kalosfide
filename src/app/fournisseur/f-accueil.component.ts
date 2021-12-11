import { Component, OnInit } from '@angular/core';
import { Site } from '../modeles/site/site';
import { PageDef } from '../commun/page-def';
import { FournisseurPages } from './fournisseur-pages';
import { IBarreTitre } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { FournisseurClientPages } from './clients/client-pages';
import { Identifiant } from '../securite/identifiant';
import { AppSite } from '../app-site/app-site';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';
import { ApiDoc } from '../modeles/c-l-f/api-doc';
import { CLFDoc } from '../modeles/c-l-f/c-l-f-doc';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class FAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = FournisseurPages.accueil;

    identifiant: Identifiant;
    site: Site;

    constructor(
        private service: FournisseurCLFService,
    ) {
        super();
    }

    get titre(): string {
        return this.site.titre;
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            groupesDeBoutons: [Fabrique.titrePage.groupeDefAccès()]
        });
        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
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

    protected créeContenus() {
        const appRouteur = Fabrique.url.appRouteur;
        this.superGroupe = new KfSuperGroupe(this.nom);
        const titre = new KfEtiquette('titre', 'Bienvenue sur votre site');
        titre.baliseHtml = KfTypeDeBaliseHTML.h6;
        this.superGroupe.ajoute(titre);
        const pasDeProduits = this.site.bilan.catalogue.produits === 0;
        const pasDeClients = this.site.bilan.clients.actifs === 0 && this.site.bilan.clients.nouveaux === 0;
        if (pasDeProduits) {
            this.superGroupe.ajoute(Fabrique.alerte(
                'catalogueVide',
                'danger',
                'Alerte',
                `Il n'y a pas de produits disponibles dans votre catalogue.`
                + ` Votre site ne peut pas fonctionner si son catalogue est vide.`,
                `Pour résoudre ce problème, allez sur la page `,
                {
                    pageDef: FournisseurPages.catalogue,
                    routeur: appRouteur.gestion
                }
            ));
        } else {
            if (!this.site.ouvert && !pasDeClients) {
                this.superGroupe.ajoute(Fabrique.alerte(
                    'siteOuvert',
                    'danger',
                    'Alerte',
                    `Une modification du catalogue est en cours.`
                    + ` Vos clients ne peuvent pas commander quand une modification du catalogue est en cours.`,
                    `Pour résoudre ce problème, allez sur la page `,
                    {
                        pageDef: FournisseurPages.catalogue,
                        routeur: appRouteur.gestion
                    }
                ));
            }
        }
        if (pasDeClients) {
            this.superGroupe.ajoute(Fabrique.alerte(
                'pasDeClients',
                'danger',
                'Alerte',
                `Il n'y a pas de clients actifs sur votre site.`
                + ` Votre site ne peut pas fonctionner s'il n'a pas de clients.`,
                `Pour résoudre ce problème, allez sur la page `,
                {
                    pageDef: FournisseurPages.clients,
                    routeur: appRouteur.gestion
                },
            ));
        } else {
            if (this.site.bilan.clients.nouveaux > 0) {
                const t: { un_nouveau_client: string, son_compte: string } = this.site.bilan.clients.nouveaux === 1
                    ? { un_nouveau_client: 'un nouveau client', son_compte: 'son compte' }
                    : { un_nouveau_client: 'de nouveaux clients', son_compte: 'leurs comptes' }
                this.superGroupe.ajoute(Fabrique.alerte(
                    'nouveauxClients',
                    'primary',
                    'Nouveau',
                    `Vous avez ${t.un_nouveau_client}.`
                    + ` Vous devez activer ${t.son_compte} avant de pouvoir créer des bons de livraison et des factures.`,
                    `Pour résoudre ce problème, allez sur la page `,
                    {
                        pageDef: FournisseurClientPages.index,
                        routeur: appRouteur.clients
                    },
                    'Comptes clients'
                ));
            }
        }
        if (this.identifiant.noDernierRole === undefined) {
            // c'est la première connection
            return;
        }
        if (!this.site.nouveauxDocs) {
            // il n'y a pas eu de déconnection
            this.superGroupe.ajoute(Fabrique.alerte(
                'deconnecte',
                'warning',
                'Dommage!',
                `Vous ne vous êtes pas déconnecté à la fin de votre session précédente sur ${AppSite.nom}. `
                + `Vous ne pouvez pas savoir ici si de nouveaux bons de commande sont arrivés depuis.`,
                `Pour découvrir s'il y a des bons de commande à traiter, allez sur la page `,
                {
                    pageDef: FournisseurPages.livraison,
                    routeur: appRouteur.fournisseur
                },
            ));
            // l'avertissement ne doit apparaître qu'une seule fois
            this.site.nouveauxDocs = [];
            this.service.identification.fixeIdentifiant(this.identifiant);
        } else {
            if (this.site.nouveauxDocs.length > 0) {
                const t: { un_nouveau_bon: string, le: string } = this.site.nouveauxDocs.length === 1
                    ? { un_nouveau_bon: 'un nouveau bon de commande', le: 'le' }
                    : { un_nouveau_bon: 'de nouveaux bons de commande', le: 'les' }
                this.superGroupe.ajoute(Fabrique.alerte(
                    'nouveauxDocs',
                    'success',
                    'Nouveau',
                    `Depuis votre dernière déconnection de ${AppSite.nom}, vous avez reçu ${t.un_nouveau_bon}.`,
                    `Pour ${t.le} traiter, allez sur la page `,
                    {
                        pageDef: FournisseurPages.livraison,
                        routeur: appRouteur.fournisseur
                    },
                ));
            }
        }
    }

    private rafraichit() {
        this.barre.site = this.service.identification.siteEnCours;
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.identifiant = this.service.identification.litIdentifiant();
        this.site = Identifiant.siteEnCours(this.identifiant);
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
        this.rafraichit();
    }

}
