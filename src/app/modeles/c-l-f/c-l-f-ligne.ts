import { IKeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/i-key-uid-rno-no-2';
import { Produit } from '../catalogue/produit';
import { CLFDoc } from './c-l-f-doc';
import { ApiLigne, ApiLigneAEnvoyer } from './api-ligne';
import { CLFLigneEditeur } from './c-l-f-ligne-editeur';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { TypeMesure } from '../type-mesure';
import { Client } from '../client/client';
import { IdEtatRole } from '../role/etat-role';
import { TypeCommande } from '../type-commande';

export class CLFLigne implements IKeyUidRnoNo2 {
    private pParent: CLFDoc;
    apiLigne: ApiLigne;

    /**
     * Produit demandé
     */
    private pProduit: Produit;

    private copiableFnc: () => boolean;

    private pEditeur: CLFLigneEditeur;

    constructor(parent: CLFDoc, produit: Produit) {
        this.pParent = parent;
        this.pProduit = produit;
        const type = parent.type;
        const typeSynthèse = parent.clfDocs.type;
        if (typeSynthèse !== type) {
            switch (type) {
                case 'commande':
                    this.copiableFnc = () =>
                        !(this.produit.typeCommande === TypeCommande.id.ALUnitéOuEnVrac && this.typeCommande === TypeCommande.id.ALUnité);
                    break;
                case 'livraison':
                    this.copiableFnc = () => true;
                    break;
            }
        }
    }

    get copiable(): boolean {
        return this.copiableFnc();
    }

    get parent(): CLFDoc {
        return this.pParent;
    }

    get uid(): string { return this.pParent.uid; }
    get rno(): number { return this.pParent.rno; }
    get no(): number { return this.pParent.no; }
    get uid2(): string { return this.pProduit.uid; }
    get rno2(): number { return this.pProduit.rno; }
    get no2(): number { return this.pProduit.no; }

    get produit(): Produit { return this.pProduit; }
    /** présent si dans bon */
    get client(): Client { return this.pParent.client; }

    get date(): Date {
        return this.apiLigne.date;
    }

    créeEditeur(component: IDataComponent) {
        this.pEditeur = new CLFLigneEditeur(this, component);
    }
    get éditeur(): CLFLigneEditeur {
        return this.pEditeur;
    }


    get nomProduit(): string { return this.pProduit.nom; }
    get noCategorie(): number { return this.pProduit.categorieNo; }
    get nomCategorie(): string { return this.pProduit.nomCategorie; }
    get typeMesure(): string { return this.pProduit.typeMesure; }
    get prix(): number { return this.pProduit.prix; }

    get nomClient(): string { return this.client ? this.client.nom : undefined; }
    get nouveauClient(): boolean { return this.client ? this.client.etat === IdEtatRole.nouveau : false; }
    get texteClient(): string { return this.client ? this.nomClient + (this.nouveauClient ? ' (nouveau)' : '') : undefined; }
    get labelClient(): string { return 'Client' + (this.nouveauClient ? ' (nouveau)' : ''); }

    get typeCommande(): string {
        return (this.pEditeur && this.pEditeur.kfTypeCommande && this.pEditeur.kfTypeCommande.aUneValeur)
            ? this.pEditeur.kfTypeCommande.valeur
            : this.apiLigne.typeCommande
                ? this.apiLigne.typeCommande
                : TypeMesure.typeCommandeParDéfaut(this.pProduit.typeMesure);
    }
    get quantité(): number {
        return (this.pEditeur && this.pEditeur.kfQuantité && this.pEditeur.kfQuantité.aUneValeur)
            ? this.pEditeur.kfQuantité.valeur
            : this.apiLigne.quantité;
    }

    get aFixer(): number {
        return (this.pEditeur && this.pEditeur.kfAFixer && this.pEditeur.kfAFixer.aUneValeur)
            ? this.pEditeur.kfAFixer.valeur
            : this.apiLigne.aFixer;
    }
    set aFixer(valeur: number) {
        this.apiLigne.aFixer = valeur;
        if (this.pEditeur && this.pEditeur.kfAFixer) {
            this.pEditeur.kfAFixer.valeur = valeur;
        }
    }

    /**
     * sauve les valeurs éditées et retourne l'ApiLigne à poster
     */
    apiLigneAEnvoyer(): ApiLigneAEnvoyer {
        // sauve les valeurs éditées pour qu'elles survivent aux controls
        if (this.pEditeur.kfAFixer) {
            this.apiLigne.aFixer = this.pEditeur.kfAFixer.valeur;
        } else {
            const typeCommande = this.pEditeur.kfTypeCommande ? this.pEditeur.kfTypeCommande.valeur : undefined;
            if (typeCommande !== TypeMesure.typeCommandeParDéfaut(this.produit.typeMesure)) {
                this.apiLigne.typeCommande = typeCommande;
            }
            this.apiLigne.quantité = this.pEditeur.kfQuantité.valeur;
        }
        const apiL = new ApiLigneAEnvoyer();
        KeyUidRnoNo2.copieKey(this, apiL);
        ApiLigneAEnvoyer.copieData(this.apiLigne, apiL);
        return apiL;
    }

    /**
     * ne sauve pas la valeur éditée tant que l'Api n'a pas retourné Ok
     */
    get aFixerAEnvoyer(): number {
        if (this.pEditeur.kfAFixer) {
            return this.pEditeur.kfAFixer.valeur;
        }
    }

    get AFixerEstFixé(): boolean {
        if (this.apiLigne.aFixer !== null && this.apiLigne.aFixer !== undefined) {
            return !this.pEditeur || !this.pEditeur.kfAFixer || this.pEditeur.kfAFixer.valeur === this.apiLigne.aFixer;
        }
        return false;
    }

    sauveAFixer() {
        this.apiLigne.aFixer = this.pEditeur.kfAFixer.valeur;
        this.pEditeur.kfAFixer.valeur = this.apiLigne.aFixer;
    }

    /**
     * Vrai si le champ aFixer est renseigné.
     */
    get préparé(): boolean {
        return this.aFixer !== undefined && this.aFixer !== null;
    }

    /**
     * Vrai si le champ aFixer est 0.
     */
    get annulé(): boolean {
        return this.aFixer === 0;
    }

}
