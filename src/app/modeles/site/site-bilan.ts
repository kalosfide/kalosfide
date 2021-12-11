export class SiteBilanCatalogue {
    produits: number;
    catégories: number;

    static sontEgaux(bilan1: SiteBilanCatalogue, bilan2: SiteBilanCatalogue): boolean {
        return bilan1.produits === bilan2.produits && bilan1.catégories === bilan2.catégories;
    }
}
export class SiteBilanClients {
    actifs: number;
    nouveaux: number;

    static sontEgaux(bilan1: SiteBilanClients, bilan2: SiteBilanClients): boolean {
        return bilan1.actifs === bilan2.actifs && bilan1.nouveaux === bilan2.nouveaux;
    }
}
export class SiteBilan {
    catalogue: SiteBilanCatalogue;
    clients: SiteBilanClients;
}