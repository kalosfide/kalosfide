import { Injectable } from '@angular/core';

import { Subject, Observable, merge, Subscription } from 'rxjs';
import { JwtIdentifiant, Identifiant, ApiIdentifiant } from './identifiant';
import { Site } from '../modeles/site/site';
import { Stockage } from '../services/stockage/stockage';
import { StockageService } from '../services/stockage/stockage.service';
import { Role } from '../modeles/role/role';
import { ValeurEtObservable } from '../commun/outils/valeur-et-observable';
import { ConditionEtatSite } from '../commun/data-par-key/condition-etat-site';
import { SiteBilanCatalogue, SiteBilanClients } from '../modeles/site/site-bilan';
import { Fabrique } from '../disposition/fabrique/fabrique';

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
    private roleAChangé = new Subject<Role>();
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
                    const nouveauRole = Identifiant.roleEnCours(nouveau);
                    if (Identifiant.MêmeRole(ancien, nouveau)) {
                        if (Identifiant.MêmeSite(ancien, nouveau)) {
                            return;
                        } else {
                            this.siteAChangé.next(nouveauRole.site);
                        }
                    } else {
                        if (nouveauRole) {
                            Fabrique.url.appRouteur.site.fixeSite(nouveauRole.site.url);
                        }
                        this.roleAChangé.next(nouveauRole);
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

    public fixeRoleParUrl(urlSite: string): Role {
        const identifiant = this.litIdentifiant();
        let role: Role;
        if (identifiant) {
            role = identifiant.rolesAccessibles.find(r => r.site.url === urlSite);
            if (role && identifiant.rnoRoleEnCours !== role.rno) {
                identifiant.noDernierRole = identifiant.rnoRoleEnCours;
                identifiant.rnoRoleEnCours = role.rno;
                this.stockageIdentifiant.fixeStock(identifiant);
            }
        }
        return role;
    }

    /**
     * S'il y a un identifiant stocké, fixe à 0 son rnoRoleEnCours.
     */
    public annuleRoleEnCours() {
        const identifiant = this.stockageIdentifiant.litStock();
        if (identifiant && identifiant.rnoRoleEnCours !== 0) {
            identifiant.noDernierRole = identifiant.rnoRoleEnCours;
            identifiant.rnoRoleEnCours = 0;
            this.stockageIdentifiant.fixeStock(identifiant);
        }
    }

    public fixeSite(site: Site) {
        const identifiant = this.stockageIdentifiant.litStock();
        const role = Identifiant.roleEnCours(identifiant);
        role.site = site;
        this.stockageIdentifiant.fixeStock(identifiant);
    }

    public get roleEnCours(): Role {
        const identifiant = this.litIdentifiant();
        return Identifiant.roleEnCours(identifiant);
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
        const role = Identifiant.roleEnCours(identifiant);
        if (!SiteBilanCatalogue.sontEgaux(role.site.bilan.catalogue, bilan)) {
            role.site.bilan.catalogue = bilan;
            this.stockageIdentifiant.fixeStock(identifiant);
        }
    }

    public fixeSiteBilanClients(bilan: SiteBilanClients) {
        const identifiant = this.stockageIdentifiant.litStock();
        const role = Identifiant.roleEnCours(identifiant);
        if (!SiteBilanClients.sontEgaux(role.site.bilan.clients, bilan)) {
            role.site.bilan.clients = bilan;
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
        return stock ? Identifiant.deStock(stock) : null;
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
