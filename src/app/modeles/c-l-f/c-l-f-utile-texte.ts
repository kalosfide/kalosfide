import { TypeCLF } from './c-l-f-type';
import { CLFBilan } from './c-l-f-bilan';

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
    action: string;
    faire?: string;
    faites?: string;
}

class Bouton {
    textes: Textes;
    annulerVérifier = 'Annuler la vérification';

    constructor(textes: Textes) {
        this.textes = textes;
    }

    get vérifier(): string {
        return `Vérifier ${this.textes.le_doc}`;
    }
    get terminer(): string {
        return `Enregistrer ${this.textes.le_doc}`;
    }
}

export class Textes {
    def?: Defs;
    champ: CLFUtileTexteChamp;
    bouton?: Bouton;

    synthèse: Textes;

    constructor() {
        this.bouton = new Bouton(this);
    }

    get le_doc(): string { return `${this.def.le} ${this.def.doc}`; }
    get Le_doc(): string { return `${this.def.Le} ${this.def.doc}`; }
    get ce_doc(): string { return `${this.def.ce} ${this.def.doc}`; }
    get Ce_doc(): string { return `${this.def.Ce} ${this.def.doc}`; }
    get du_doc(): string { return `${this.def.du} ${this.def.doc}`; }
    get au_doc(): string { return `${this.def.au} ${this.def.doc}`; }
    get un_doc(): string { return `${this.def.un} ${this.def.doc}`; }

    get Le_dernier_doc(): string { return `${this.def.Le} ${this.def.dernier} ${this.def.doc} `; }

    get ce_dernier_doc(): string { return `${this.def.ce} ${this.def.dernier} ${this.def.doc} `; }

    get descriptionBonVirtuel(): string {
        return `Ce bon est virtuel car il sera supprimé lors de l'enregistrement ${this.du_doc}`
        + ` et n'apparaitra pas parmi les documents.`;
    }

    bilanRienAVérifier: (bilan: CLFBilan) => string;
    bilanNbAVérifier: (bilan: CLFBilan) => string;

    vérificationPossible = () => `La vérification puis l'enregistrement ${this.du_doc} peuvent commencer.`;
    vérificationImpossible =  () => `Pour pouvoir vérifier puis enregistrer ${this.le_doc}, au moins un ${this.def.bon} doit `
        + `être préparé puis sélectionné.`


    bilanNbAVérifierC(bilan: CLFBilan): string {
        let nbDocs: string;
        if (bilan.nbAPréparer === 1) {
            nbDocs = `une ligne`;
        } else {
            nbDocs = `${bilan.nbAPréparer} lignes`;
        }
        return `Il y a ${nbDocs} dans ${this.le_doc}.`;
    }

    bilanRienAVérifierC(bilan: CLFBilan): string {
        return `Il n'y a pas de lignes dans ${this.le_doc}`;
    }

    bilanNbAVérifierLF(bilan: CLFBilan): string {
        let docsSélectionnés: string;
        if (bilan.nbSélectionnés === 1) {
            docsSélectionnés = `un ${this.def.bon} sélectionné`;
        } else {
            docsSélectionnés = `${bilan.nbSélectionnés} ${this.def.bons} sélectionnés`;
        }
        return `Il y a ${docsSélectionnés} pour la préparation ${this.du_doc}.`;
    }

    bilanRienAVérifierLF(bilan: CLFBilan): string {
        if (bilan.nbPréparés === 0) {
            return `Il n'y a pas de ${this.def.bons} prêts à être traités dans ${this.le_doc}.`;
        }
        return `Il n'y a pas de ${this.def.bons} sélectionnés pour la préparation ${this.du_doc}.`;
    }
}

export class CLFUtileTexte {
    choixProduit: Textes;
    commande: Textes;
    livraison: Textes;
    facture: Textes;

    constructor() {
        this.créeChoixProduit();
        this.créeCommande();
        this.créeLivraison();
        this.créeFacture();
    }

    textes(type: TypeCLF): Textes {
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
        this.choixProduit = new Textes();
        const champ = new CLFUtileTexteChamp();
        champ.typeCommande = 'Se commande';
        this.choixProduit.champ = champ;
    }

    private créeCommande() {
        const textes = new Textes();
        const champ = new CLFUtileTexteChamp();
        champ.typeCommande = 'Unité';
        champ.typeMesure = 'U. V.';
        champ.aFixer = 'Quantité';
        textes.champ = champ;
        textes.def = {
            doc: 'bon de commande',
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
            action: 'commande'
        };
        textes.synthèse = this.livraison;
        textes.bilanRienAVérifier = textes.bilanRienAVérifierC;
        textes.bilanNbAVérifier = textes.bilanNbAVérifierC;
        this.commande = textes;
    }

    private créeLivraison() {
        const textes = new Textes();
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
            action: 'livraison',
            faire: 'livrer',
            faites: 'commandées'
        };
        textes.synthèse = this.facture;
        textes.bilanRienAVérifier = textes.bilanRienAVérifierLF;
        textes.bilanNbAVérifier = textes.bilanNbAVérifierLF;
        this.livraison = textes;
    }

    private créeFacture() {
        const textes = new Textes();
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
            action: 'facture',
            faire: 'facturer',
            faites: 'livrées'
        };
        textes.bilanRienAVérifier = textes.bilanRienAVérifierLF;
        textes.bilanNbAVérifier = textes.bilanNbAVérifierLF;
        this.facture = textes;
    }
}
