import { AdminRouteur } from "./admin/admin-routeur";
import { AppPages } from "./app-pages";
import { AppSitePages } from "./app-site/app-site-pages";
import { Routeur } from "./commun/routeur";
import { CataloguePages } from "./fournisseur/catalogue/catalogue-pages";
import { FournisseurPages } from "./fournisseur/fournisseur-pages";
import { CLFPages } from "./modeles/c-l-f/c-l-f-pages";
import { CommandeRouteur, LFRouteur } from "./modeles/c-l-f/c-l-f-routeur";
import { Site } from "./modeles/site/site";
import { SitePages } from "./site/site-pages";
import { SiteRouteur } from "./site/site-routeur";

export class AppSiteRouter extends Routeur {
    constructor(appRouter: AppRouteur) {
        super(appRouter, AppPages.appSite.path);
    }
}

export class AppRouteur extends Routeur {
    appSite: AppSiteRouter;
    compte: Routeur;
    site: SiteRouteur;
    client: Routeur;
    commande: CommandeRouteur;
    fournisseur: Routeur;
    livraison: LFRouteur;
    facture: LFRouteur;
    document: Routeur;
    gestion: Routeur;
    catalogue: Routeur;
    produit: Routeur;
    catégorie: Routeur;
    clients: Routeur;
    admin: AdminRouteur;
    
    constructor() {
        super(null);
        this.admin = new AdminRouteur(this);
        this.appSite = new AppSiteRouter(this);
        this.compte = new Routeur(this.appSite, AppSitePages.compte.path)

        this.site = new SiteRouteur(this);

        this.client = new Routeur(this.site, SitePages.client.path);
        this.commande = new CommandeRouteur(this.client);

        this.fournisseur = new Routeur(this.site, SitePages.fournisseur.path);
        this.livraison = new LFRouteur(this.fournisseur, CLFPages.livraison.path);
        this.facture = new LFRouteur(this.fournisseur, CLFPages.facture.path);
        this.gestion = new Routeur(this.fournisseur, FournisseurPages.gestion.path);
        this.catalogue = new Routeur(this.gestion, FournisseurPages.catalogue.path);
        this.produit = new Routeur(this.catalogue, CataloguePages.produits.path);
        this.catégorie = new Routeur(this.catalogue, CataloguePages.categories.path);
        this.clients = new Routeur(this.gestion, FournisseurPages.clients.path);
    }

    get image(): Routeur {
        return new Routeur(this, 'assets');
    }

    routeurDeSite(site: Site): Routeur {
        const routeur = new SiteRouteur(this);
        routeur.fixeSite(site.url);
        return site.client
            ? new Routeur(routeur, SitePages.client.path)
            : new Routeur(routeur, SitePages.fournisseur.path);
    }

}