import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { JwtIdentifiant, Identifiant, ApiIdentifiant } from './identifiant';
import { Site } from '../modeles/site/site';
import { Stockage } from '../services/stockage/stockage';
import { StockageService } from '../services/stockage/stockage.service';

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

    constructor(
        stockageService: StockageService
    ) {
        // quand un utilisateur se connecte ou se déconnecte, un identifiant est stocké
        this.stockageJwtIdentifiant = stockageService.nouveau('JwtIdentifiant');
        this.stockageIdentifiant = stockageService.nouveau('Identifiant', {
            // appellé quand l'identifiant stocké change
            quandStockChange: (ancien: Identifiant, nouveau: Identifiant) => {
                if (ancien !== null && nouveau !== null && nouveau !== undefined && ancien.uid === nouveau.uid) {
                    return;
                }
                this.utilisateurAChangé.next(nouveau);
            },
            // tous les stockages dépendant de l'identité de l'utilisateur sont vidés quand l'utilisateur change
            déclencheVidage: this.utilisateurAChangé.asObservable()
        });
    }

    public get estIdentifié(): boolean {
        return !this.stockageIdentifiant.estVide();
    }

    /**
     * Emet l'identifiant à la connection et null à la déconnection
     */
    public changementDUtilisateur(): Observable<Identifiant> {
        return this.utilisateurAChangé.asObservable();
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
        return stock ? Identifiant.copie(stock) : null;
    }

    public fixeIdentifiants(jwtIdentifiantSérialisé: string, apiIdentifiant: ApiIdentifiant): void {
        this.stockageJwtIdentifiant.fixeStock(JSON.parse(jwtIdentifiantSérialisé) as JwtIdentifiant);
        this.stockageIdentifiant.fixeStock(Identifiant.crée(apiIdentifiant));
    }

    public fixeSiteIdentifiant(site: Site) {
        const identifiant = this.stockageIdentifiant.litStock();
        if (identifiant) {
            const index = identifiant.sites.findIndex((s: Site) => site.uid === s.uid && site.rno === s.rno);
            identifiant.sites[index] = site;
            this.stockageIdentifiant.fixeStock(identifiant);
        }
    }

    public déconnecte(): void {
        this.stockageJwtIdentifiant.fixeStock(undefined);
        this.stockageIdentifiant.fixeStock(undefined);
    }
}
