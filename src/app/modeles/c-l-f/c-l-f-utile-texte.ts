import { TypeCLF } from './c-l-f-type';
import { CLFNbBons } from './c-l-f-nb-bons';
import { CLFDoc } from './c-l-f-doc';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';

export class CLFUtileTexteChamp {
    categorie = 'Catégorie';
    produit = 'Produit';
    prix = 'Prix';
    fixé = 'Quantité';
    typeCommande?: string;
    typeMesure?: string;
    source?: string;
    aFixer?: string;

}

class Defs {
    bon?: string;
    Bon?: string;
    Bons?: string;
    bons?: string;
    doc: string;
    docs: string;
    Doc: string;
    le: string;
    Le: string;
    ce: string;
    Ce: string;
    du: string;
    au: string;
    un: string;
    il: string;
    Il: string;
    dernier: string;
    prochain: string;
    action: string;
    faire?: string;
    faite?: string;
    adressé: string;
    enregistré: string;
    nouveau: string;
    nouveaux: string;
}

export class CLFTextes {
    def?: Defs;
    champ: CLFUtileTexteChamp;

    synthèse: CLFTextes;

    get le_doc(): string { return `${this.def.le} ${this.def.doc}`; }
    get Le_doc(): string { return `${this.def.Le} ${this.def.doc}`; }
    get ce_doc(): string { return `${this.def.ce} ${this.def.doc}`; }
    get Ce_doc(): string { return `${this.def.Ce} ${this.def.doc}`; }
    get du_doc(): string { return `${this.def.du} ${this.def.doc}`; }
    get au_doc(): string { return `${this.def.au} ${this.def.doc}`; }
    get un_doc(): string { return `${this.def.un} ${this.def.doc}`; }

    get Le_dernier_doc(): string { return `${this.def.Le} ${this.def.dernier} ${this.def.doc} `; }

    get le_prochain_doc(): string { return `${this.def.le} ${this.def.prochain} ${this.def.doc} `; }

    get ce_dernier_doc(): string { return `${this.def.ce} ${this.def.dernier} ${this.def.doc} `; }

    get descriptionBonVirtuel(): string {
        return `Ce bon est virtuel car il sera supprimé lors de l'enregistrement ${this.du_doc}`
            + ` et n'apparaitra pas parmi les documents.`;
    }

    get copierBon(): string {
        return `Copier la quantité ${this.def.faite} de chaque produit dans la quantité à ${this.def.faire} `;
    }

    get copierBons(): string {
        return `Copier les quantités ${this.def.faite}s de chaque ${this.def.bon} dans les quantités à ${this.def.faire} `;
    }

    get nouveau_doc(): string {
        return `${this.def.nouveau} ${this.def.doc}`
    }
    get nouveaux_docs(): string {
        return `${this.def.nouveaux} ${this.def.docs}`
    }
    en_toutes_lettres: (nb: number) => string;
    en_toutes_lettresMasculin(nb: number): string {
        return TexteOutils.en_toutes_lettres(nb);
    }
    en_toutes_lettresFéminin(nb: number): string {
        return TexteOutils.en_toutes_lettres(nb, { unitéFéminin: true });
    }

    bilanRienAVérifier: (bilan: CLFNbBons) => string;
    bilanNbAVérifier: (bilan: CLFNbBons) => string;

    vérificationPossible = () => `La vérification puis l'enregistrement ${this.du_doc} peuvent commencer.`;
    vérificationImpossible = () => `Pour pouvoir vérifier puis enregistrer ${this.le_doc}, au moins un ${this.def.bon} doit `
        + `être préparé puis sélectionné.`

    bilanNbAVérifierC(bilan: CLFNbBons): string {
        let nbDocs: string;
        if (bilan.total === 1) {
            nbDocs = `une ligne`;
        } else {
            nbDocs = `${bilan.total} lignes`;
        }
        return `Il y a ${nbDocs} dans ${this.le_doc}.`;
    }

    bilanRienAVérifierC(bilan: CLFNbBons): string {
        return `Il n'y a pas de lignes dans ${this.le_doc}`;
    }

    bilanNbAVérifierLF(bilan: CLFNbBons): string {
        let docsSélectionnés: string;
        if (bilan.sélectionnés === 1) {
            docsSélectionnés = `un ${this.def.bon} sélectionné`;
        } else {
            docsSélectionnés = `${bilan.sélectionnés} ${this.def.bons} sélectionnés`;
        }
        return `Il y a ${docsSélectionnés} pour la préparation ${this.du_doc}.`;
    }

    bilanRienAVérifierLF(bilan: CLFNbBons): string {
        if (bilan.préparés === 0) {
            return `Il n'y a pas de ${this.def.bons} prêts à être traités dans ${this.le_doc}.`;
        }
        return `Il n'y a pas de ${this.def.bons} sélectionnés pour la préparation ${this.du_doc}.`;
    }
}

export class CLFUtileTexte {
    choixProduit: CLFTextes;
    commande: CLFTextes;
    livraison: CLFTextes;
    facture: CLFTextes;

    constructor() {
        this.créeChoixProduit();
        this.créeCommande();
        this.créeLivraison();
        this.créeFacture();
    }

    textes(type: TypeCLF): CLFTextes {
        switch (type) {
            case 'commande':
                return this.commande;
            case 'livraison':
                return this.livraison;
            case 'facture':
                return this.facture;
        }
    }

    private créeChoixProduit() {
        this.choixProduit = new CLFTextes();
        const champ = new CLFUtileTexteChamp();
        champ.typeCommande = 'Se commande';
        this.choixProduit.champ = champ;
    }

    private créeCommande() {
        const textes = new CLFTextes();
        const champ = new CLFUtileTexteChamp();
        champ.typeCommande = 'Unité';
        champ.typeMesure = 'U. V.';
        champ.aFixer = 'Quantité';
        textes.champ = champ;
        textes.def = {
            doc: 'bon de commande',
            docs: 'bons de commande',
            Doc: 'Bon de commande',
            le: 'le',
            Le: 'Le',
            ce: 'ce',
            Ce: 'Ce',
            du: 'du',
            au: 'au',
            un: 'un',
            il: 'il',
            Il: 'Il',
            dernier: 'dernier',
            prochain: 'prochain',
            action: 'commande',
            adressé: 'adressé',
            enregistré: 'enregistré',
            nouveau: 'nouveau',
            nouveaux: 'nouveaux',
        };
        textes.en_toutes_lettres = textes.en_toutes_lettresMasculin;
        textes.synthèse = this.livraison;
        textes.bilanRienAVérifier = textes.bilanRienAVérifierC;
        textes.bilanNbAVérifier = textes.bilanNbAVérifierC;
        this.commande = textes;
    }

    private créeLivraison() {
        const textes = new CLFTextes();
        const champ = new CLFUtileTexteChamp();
        champ.typeCommande = 'U. C.';
        champ.typeMesure = 'Unité';
        champ.source = 'Commandé';
        champ.aFixer = 'A livrer';
        textes.champ = champ;
        textes.def = {
            bon: 'bon de commande',
            Bon: 'Bon de commande',
            Bons: 'Bons de commande',
            bons: 'bons de commande',
            doc: 'bon de livraison',
            docs: 'bons de livraison',
            Doc: 'Bon de livraison',
            le: 'le',
            Le: 'Le',
            ce: 'ce',
            Ce: 'Ce',
            du: 'du',
            au: 'au',
            un: 'un',
            il: 'il',
            Il: 'Il',
            dernier: 'dernier',
            prochain: 'prochain',
            action: 'livraison',
            faire: 'livrer',
            faite: 'commandée',
            adressé: 'adressé',
            enregistré: 'enregistré',
            nouveau: 'nouveau',
            nouveaux: 'nouveaux',
        };
        textes.en_toutes_lettres = textes.en_toutes_lettresMasculin;
        textes.synthèse = this.facture;
        textes.bilanRienAVérifier = textes.bilanRienAVérifierLF;
        textes.bilanNbAVérifier = textes.bilanNbAVérifierLF;
        this.livraison = textes;
    }

    private créeFacture() {
        const textes = new CLFTextes();
        const champ = new CLFUtileTexteChamp();
        champ.typeMesure = 'Unité';
        champ.source = 'Livré';
        champ.aFixer = 'A facturer';
        textes.champ = champ;
        textes.def = {
            bon: 'bon de livraison',
            Bon: 'Bon de livraison',
            Bons: 'Bons de livraison',
            bons: 'bons de livraison',
            doc: 'facture',
            docs: 'factures',
            Doc: 'Facture',
            le: 'la',
            Le: 'La',
            ce: 'cette',
            Ce: 'Cette',
            du: 'de la',
            au: 'à la',
            un: 'une',
            il: 'elle',
            Il: 'Elle',
            dernier: 'dernière',
            prochain: 'prochaine',
            action: 'facture',
            faire: 'facturer',
            faite: 'livrée',
            adressé: 'adressée',
            enregistré: 'enregistrée',
            nouveau: 'nouvelle',
            nouveaux: 'nouvelles',
        };
        textes.en_toutes_lettres = textes.en_toutes_lettresFéminin;
        textes.bilanRienAVérifier = textes.bilanRienAVérifierLF;
        textes.bilanNbAVérifier = textes.bilanNbAVérifierLF;
        this.facture = textes;
    }

    listeNos(docs: CLFDoc[]): string {
        const nos: number[] = docs.map(d => d.no);
        if (nos.length === 1) {
            return '' + nos[0];
        }
        const dernier = nos.pop();
        return TexteOutils.joint(docs.map(d => d.no), ', ', true);
    }
}
