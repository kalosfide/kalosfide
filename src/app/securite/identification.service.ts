import { Injectable } from '@angular/core';

import { Subject, Observable, merge, Subscription } from 'rxjs';
import { JwtIdentifiant, Identifiant, ApiIdentifiant } from './identifiant';
import { ISiteEtat, Site } from '../modeles/site/site';
import { Stockage } from '../services/stockage/stockage';
import { StockageService } from '../services/stockage/stockage.service';
import { ValeurEtObservable } from '../commun/outils/valeur-et-observable';
import { ConditionEtatSite } from '../commun/data-par-key/condition-etat-site';
import { SiteBilanCatalogue, SiteBilanClients } from '../modeles/site/site-bilan';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { EtatRole } from '../modeles/role/etat-role';

@Injectable({
    providedIn: 'root',
})
export class IdentificationService {
    /**
     * Stockage du jeton
     */
    private stockageJwtIdentifiant: Stockage<JwtIdentifiant>;
    /**
     * Stockage de l'identifiant
     */
    private stockageIdentifiant: Stockage<Identifiant>;

    private utilisateurAChangé = new Subject<Identifiant>();
    private roleAChangé = new Subject<Site>();
    private siteAChangé = new Subject<Site>();

    private pConditionSite: ConditionEtatSite;

    constructor(
        stockageService: StockageService
    ) {
        // quand un utilisateur se connecte ou se déconnecte, un identifiant est stocké
        this.stockageJwtIdentifiant = stockageService.nouveau('JwtIdentifiant');
        this.stockageIdentifiant = stockageService.nouveau('Identifiant', {
            // appellé quand l'identifiant stocké change
            quandStockChange: (ancien: Identifiant, nouveau: Identifiant) => {
                if (Identifiant.MêmeUtilisateur(ancien, nouveau)) {
                    const nouveauSite = Identifiant.siteEnCours(nouveau);
                    if (Identifiant.MêmeSite(ancien, nouveau)) {
                        if (Identifiant.SitesIdentiques(ancien, nouveau)) {
                            return;
                        } else {
                            this.siteAChangé.next(nouveauSite);
                        }
                    } else {
                        if (nouveauSite) {
                            Fabrique.url.appRouteur.site.fixeSite(nouveauSite.url);
                        }
                        this.roleAChangé.next(nouveauSite);
                    }
                } else {
                    this.utilisateurAChangé.next(nouveau);
                }
            },
            // tous les stockages dépendant de l'identité de l'utilisateur sont vidés quand l'utilisateur ou le role change
            déclencheVidage: merge(this.utilisateurAChangé.asObservable(), this.roleAChangé.asObservable())
        });
        this.pConditionSite = new ConditionEtatSite(ValeurEtObservable.nouveau(this.siteEnCours, this.siteAChangé.asObservable()));
    }

    /**
     * Emet l'identifiant à la connection et null à la déconnection
     */
    public changementDUtilisateur(): Observable<Identifiant> {
        return this.utilisateurAChangé.asObservable();
    }

    public fixeSiteParUrl(urlSite: string): Site {
        const identifiant = this.litIdentifiant();
        let site: Site;
        if (!identifiant) {
            return;
        }
        site = identifiant.sites.find(s => s.url === urlSite);
        if (site.fournisseur.etat === EtatRole.fermé) {
            return;
        }
        if (site.client && site.client.etat === EtatRole.fermé) {
            return; 
        }
        if (identifiant.idSiteEnCours !== site.id) {
            identifiant.idSiteEnCours = site.id;
            this.stockageIdentifiant.fixeStock(identifiant);
        }
        return site;
    }

    /**
     * S'il y a un identifiant stocké, fixe à 0 son idSiteeEnCours.
     */
    public annuleSiteEnCours() {
        const identifiant = this.stockageIdentifiant.litStock();
        if (identifiant && identifiant.idSiteEnCours !== 0) {
            identifiant.idSiteEnCours = 0;
            this.stockageIdentifiant.fixeStock(identifiant);
        }
    }

    public fixeEtatSite(étatSite: ISiteEtat) {
        const identifiant = this.stockageIdentifiant.litStock();
        const site = identifiant.sites.find(s => s.id === identifiant.idSiteEnCours);
        Site.copieEtat(étatSite, site);
        this.stockageIdentifiant.fixeStock(identifiant);
    }

    public get siteEnCours(): Site {
        const identifiant = this.litIdentifiant();
        return Identifiant.siteEnCours(identifiant);
    }

    public souscritASiteChange(traitement: (site: Site) => void): Subscription {
        return this.siteAChangé.asObservable().subscribe((site: Site) => traitement(site));
    }

    public fixeSiteBilanCatalogue(bilan: SiteBilanCatalogue) {
        const identifiant = this.stockageIdentifiant.litStock();
        const site = identifiant.sites.find(s => s.id === identifiant.idSiteEnCours);
        if (!SiteBilanCatalogue.sontEgaux(site.bilan.catalogue, bilan)) {
            site.bilan.catalogue = bilan;
            this.stockageIdentifiant.fixeStock(identifiant);
        }
    }

    public fixeSiteBilanClients(bilan: SiteBilanClients) {
        const identifiant = this.stockageIdentifiant.litStock();
        const site = identifiant.sites.find(s => s.id === identifiant.idSiteEnCours);
        if (!SiteBilanClients.sontEgaux(site.bilan.clients, bilan)) {
            site.bilan.clients = bilan;
            this.stockageIdentifiant.fixeStock(identifiant);
        }
    }

    get conditionSite(): ConditionEtatSite {
        return this.pConditionSite;
    }

    public get estIdentifié(): boolean {
        return !this.stockageIdentifiant.estVide();
    }

    get nomStockageIdentifiant(): string {
        return this.stockageIdentifiant.nom;
    }

    public get jeton(): string {
        const identifiant = this.litJwtIdentifiant();
        return identifiant ? identifiant.Jeton : null;
    }

    private litJwtIdentifiant(): JwtIdentifiant {
        return this.stockageJwtIdentifiant.litStock();
    }

    public litIdentifiant(): Identifiant {
        const stock = this.stockageIdentifiant.litStock();
        return stock;
    }

    public fixeIdentifiant(identifiant: Identifiant) {
        this.stockageIdentifiant.fixeStock(identifiant);
    }

    public fixeIdentifiants(jwtIdentifiantSérialisé: string, apiIdentifiant: ApiIdentifiant): void {
        this.stockageJwtIdentifiant.fixeStock(JSON.parse(jwtIdentifiantSérialisé) as JwtIdentifiant);
        this.stockageIdentifiant.fixeStock(Identifiant.àStocker(apiIdentifiant));
    }

    public déconnecte(): void {
        this.stockageJwtIdentifiant.fixeStock(undefined);
        this.stockageIdentifiant.fixeStock(undefined);
    }
}
