import { Produit, IAvecProduit } from './catalogue/produit';
import { Client } from './client/client';

export class Compare {
    static compareMinuscules(s1: string, s2: string): number {
        const n1 = s1.toLocaleLowerCase();
        const n2 = s2.toLocaleLowerCase();
        return n1 < n2 ? -1 : n1 === n2 ? 0 : 1;
    }

    private static _testAvecProduit(produitOuAvecProduit: Produit | IAvecProduit): Produit {
        const avecProduit: any = produitOuAvecProduit;
        const produit = avecProduit.produit
            ? avecProduit.produit as Produit
            : avecProduit as Produit;
        return produit;
    }

    static nomProduit = (produitOuAvecProduit1: Produit | IAvecProduit, produitOuAvecProduit2: Produit | IAvecProduit): number => {
        const produit1 = Compare._testAvecProduit(produitOuAvecProduit1);
        const produit2 = Compare._testAvecProduit(produitOuAvecProduit2);
        return Compare.compareMinuscules(produit1.nom, produit2.nom);
    }
    static nomCatégorie = (produitOuAvecProduit1: Produit | IAvecProduit, produitOuAvecProduit2: Produit | IAvecProduit): number => {
        const produit1 = Compare._testAvecProduit(produitOuAvecProduit1);
        const produit2 = Compare._testAvecProduit(produitOuAvecProduit2);
        return Compare.compareMinuscules(produit1.nomCategorie, produit2.nomCategorie);
    }

    private static _testAvecClient(nomFonction: string, avecClient: any): Client {
        if (!avecClient.client) {
            throw new Error(`${nomFonction}: le paramètre doit avoir une propriété 'client' de type Client`);
        }
        return avecClient.client as Client;
    }

    static nomClient = (client1: Client, client2: Client): number => {
        return Compare.compareMinuscules(client1.nom, client2.nom);
    }

    static AvecClient_nomClient(avecClient1: any, avecClient2: any): number {
        const client1 = Compare._testAvecClient('', avecClient1);
        const client2 = Compare._testAvecClient('', avecClient2);
        return Compare.nomClient(client1, client2);
    }
}
