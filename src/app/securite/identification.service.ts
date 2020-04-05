import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { JwtIdentifiant, Identifiant } from './identifiant';
import { Site } from '../modeles/site/site';
import { Stockage } from '../services/stockage/stockage';
import { StockageService } from '../services/stockage/stockage.service';

@Injectable({
    providedIn: 'root',
})
export class IdentificationService {

    private _stockageJwtIdentifiant: Stockage<JwtIdentifiant>;
    private _stockageIdentifiant: Stockage<Identifiant>;

    private utilisateurAChangé = new Subject<boolean>();

    constructor(
        stockageService: StockageService
    ) {
        this._stockageJwtIdentifiant = stockageService.nouveau('JwtIdentifiant', { rafraichit: 'aucun'});
        this._stockageIdentifiant = stockageService.nouveau('Identifiant', {
            quandStockChange : (ancien: Identifiant, nouveau: Identifiant) => {
                if (!nouveau || !ancien || ancien.userId !== nouveau.userId) {
                    this.utilisateurAChangé.next(true);
                }
            },
            rafraichit: 'déclenche',
            doitRéinitialiser: this.utilisateurAChangé.asObservable()
        });
    }

    public get estIdentifié(): boolean {
        return !this._stockageIdentifiant.estNull();
    }

    /**
     * se produit à la connection et la déconnection
     */
    public changementDUtilisateur(): Observable<boolean> {
        return this.utilisateurAChangé.asObservable();
    }

    public get jeton(): string {
        const identifiant = this.litJwtIdentifiant();
        return identifiant ? identifiant.Jeton : null;
    }

    private litJwtIdentifiant(): JwtIdentifiant {
        return this._stockageJwtIdentifiant.litStock();
    }

    public litIdentifiant(): Identifiant {
        const stock = this._stockageIdentifiant.litStock();
        return stock ? new Identifiant(stock) : null;
    }

    public fixeIdentifiants(jwtIdentifiantSérialisé: string, identifiant: Identifiant): void {
        this._stockageJwtIdentifiant.fixeStock(JSON.parse(jwtIdentifiantSérialisé) as JwtIdentifiant);
        this._stockageIdentifiant.fixeStock(identifiant);
    }

    public fixeSiteIdentifiant(site: Site) {
        const identifiant = this._stockageIdentifiant.litStock();
        if (identifiant) {
            const index = identifiant.sites.findIndex((s: Site) => site.uid === s.uid && site.rno === s.rno);
            identifiant.sites[index] = site;
            this._stockageIdentifiant.fixeStock(identifiant);
        }
    }

    public déconnecte(): void {
        this._stockageJwtIdentifiant.fixeStock(undefined);
        this._stockageIdentifiant.fixeStock(undefined);
    }
}
