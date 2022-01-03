import { ApiDoc } from './api-doc';
import { IKeyId } from 'src/app/commun/data-par-key/key-id/i-key-id';
import { Catalogue } from '../catalogue/catalogue';
import { Client } from '../client/client';
import { CLFLigne } from './c-l-f-ligne';
import { CLFDoc } from './c-l-f-doc';
import { Produit } from '../catalogue/produit';
import { Site } from '../site/site';
import { IKeyIdNo } from 'src/app/commun/data-par-key/key-id-no/i-key-id-no';
import { CLFNbBons } from './c-l-f-nb-bons';
import { typeCLF, TypeCLF } from './c-l-f-type';

/**
 * Contient des documents
 * Objet stocké
 */
export class CLFDocs {
    /**
     * Type du document à éditer
     */
    type: TypeCLF;

    /**
     * Key de l'identifiant de l'utilisateur.
     * Ajouté quand le CLFDocs est stocké et vérifié à chaque lecture du stock pour recharger le stock si changé
     */
    keyIdentifiant: IKeyId;

    /**
     * Site réduit qui peut contenir idet etat.
     * Ajouté avec id et etat quand le CLFDocs est stocké et vérifié à chaque lecture du stock pour recharger le stock si changé
     * Chargé avec etat seulement pour vérifier s'il faut recharger le stock.
     */
    site: Site;

    /**
     * Présent quand les documents sont chargés pour une édition.
     * Chargé avec date seulement pour vérifier s'il faut recharger le stock.
     */
    catalogue: Catalogue;

    /**
     * Présent quand les documents sont chargés pour une édition ou une vue.
     */
    client: Client;

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    clients: Client[];

    /**
     * Présent quand les documents sont chargés pour une édition ou une vue.
     * Pour une vue, contient seulement le document à visualiser.
     * Quand un client va créer ou éditer une commande, contient seulement la dernière commande non refusée.
     * Quand le fournisseur va créer ou éditer le bon de livraison d'un client, contient les commandes de ce client
     * avec date et sans numéro de livraison (il peut y en avoir plusieurs) ou s'il n'y en a pas, la commande virtuelle
     * par transformation de la dernière livraison en fixant le type à 'commande' et le no à 0.
     * Quand le fournisseur va créer ou éditer la facture d'un client, contient les livraisons de ce client
     * avec date sans numéro de facture
     */
    apiDocs: ApiDoc[];

    /**
     * Catalogue contenant les produits et catégories avec date à utiliser pour les lignes ayant cette date.
     * Présent quand les documents sont chargés pour une synthèse ou une vue s'il y a des lignes dont le produit
     * ou sa catégorie a été modifié.
     */
    tarif: Catalogue;

    /**
     * Présent quand le fournisseur est en train d'éditer le bon de livraison ou la facture d'un client pour stocker les données éditées.
     */
    private pClfBilan: CLFNbBons;

    constructor() { }

    /**
     * Copie tous les champs du ClfDocs stocké par le service
     * @param stocké ClfDocs stocké par le service
     */
    copie(stocké: CLFDocs) {
        this.type = stocké.type;
        this.keyIdentifiant = stocké.keyIdentifiant;
        this.site = stocké.site;
        this.client = stocké.client;
        this.tarif = stocké.tarif;
        this.apiDocs = stocké.apiDocs;
        this.pClfBilan = stocké.clfBilan;
    }

    get typeASynthétiser(): TypeCLF {
        return this.type === 'livraison' ? 'commande' : this.type === 'facture' ? 'livraison' : undefined;
    }

    get keyClient(): IKeyId { return this.client ? this.client : this.keyIdentifiant; }

    get sansBonVirtuelOuvert(): boolean {
        const apiDoc = this.apiDocs.find(d => d.no === 0 && !d.date);
        return !apiDoc;
    }

    /**
     * Un clfDocs est un contexte s'il ne contient pas d'ApiDocs
     */
    get estContexte(): boolean {
        return !this.apiDocs;
    }

    fixeCatalogue(catalogue: Catalogue) {
        if (this.tarif) {
            this.tarif.produits.forEach(p => p.nom = p.nom + ' (vieux)');
            this.tarif.produits.forEach(produit => {
                let catégorie = this.tarif.catégories.find(c => c.id === produit.categorieId);
                if (!catégorie) {
                    catégorie = catalogue.catégories.find(c => c.id === produit.categorieId);
                }
                produit.nomCategorie = catégorie.nom;
            });
        }
        this.catalogue = catalogue;
    }

    /**
     * Fixe la valeur de la propriété qui indique si le document fera partie de la synthèse
     * @param noDoc no du document
     * @param choisi true ou false
     */
    changeChoisi(noDoc: number, choisi: boolean) {
        const apiDoc = this.apiDocs.find(d => d.no === noDoc);
        apiDoc.choisi = choisi;
    }

    get clfBilan(): CLFNbBons {
        return this.pClfBilan;
    }

    créeBilanBon(apiDoc: ApiDoc): CLFNbBons {
        const bilan: CLFNbBons = {
            total: apiDoc.lignes.length,
            préparés: apiDoc.lignes.filter(l => l.aFixer !== undefined && l.aFixer !== null).length,
            annulés: apiDoc.lignes.filter(l => l.aFixer === 0).length,
        };
        return bilan;
    }

    private créeBilanASynthétiser(): CLFNbBons {
        const bilan = CLFNbBons.bilanVide();
        for (const apiDoc of this.apiDocs) {
            const bilanBon = this.créeBilanBon(apiDoc);
            if (bilanBon.total > 0) {
                bilan.total++;
                if (bilanBon.total === bilanBon.préparés) {
                    bilan.préparés++;
                    if (apiDoc.choisi) {
                        bilan.sélectionnés++;
                    }
                }
                if (bilanBon.total === bilanBon.annulés) {
                    bilan.annulés++;
                    if (apiDoc.choisi) {
                        bilan.annulésSélectionnés++;
                    }
                }
            }
        }
        this.pClfBilan = bilan;
        return bilan;
    }

    créeBilan(): CLFNbBons {
        this.pClfBilan = this.type === 'commande'
            ? this.créeBilanBon(this.apiDocs[0])
            : this.créeBilanASynthétiser();
        return this.pClfBilan;
    }

    créeASyntétiser(): CLFDoc {
        let clfDoc: CLFDoc;
        if (!this.typeASynthétiser) {
            clfDoc = CLFDoc.avecLignes(this, 'commande', this.apiDocs[0]);
            return clfDoc;
        } else {
            const apiDoc = new ApiDoc();
            apiDoc.id = this.client.id;
            clfDoc = CLFDoc.nouveau(this, this.type, apiDoc);

            // Si la dernière synthèse a été créée à partir du seul bon virtuel et s'il n'y a pas de bons envoyés sans synthèse ni de bon virtuel,
            // this.apiDocs contient seulement un modèle de bon virtuel créé à partir de la dernière synthèse.
            // Ce modèle se distingue du bon virtuel ouvert par la présence des champs date et noGroupe qui ont pour valeur la date
            // et le no de la dernière synthèse.
            // Sinon this.apiDocs contient les bons envoyés sans synthèse s'il y en a et éventuellement un bon virtuel ouvert (sans date).
            if (!this.apiDocs || this.apiDocs.length === 0) {
                clfDoc.àSynthétiser = [];
                return clfDoc;
            }
            if (this.apiDocs.length === 1) {
                const apiDoc = this.apiDocs[0];
                if (apiDoc.no === 0 && apiDoc.date) {
                    clfDoc.àSynthétiser = [];
                    return clfDoc;
                }
            }
            clfDoc.àSynthétiser = this.apiDocs.map(apiDoc => CLFDoc.avecLignesEtSynthèse(this, this.typeASynthétiser, apiDoc, clfDoc));
            return clfDoc;
        }
    }

    /**
     * Crée un CLFDoc bon.
     * S'il n'y a pas un ApiDoc dans les Documents (avec le no correspondant si le type n'est pas 'commande'),
     * le champ lignes du bon créé est indéfini.
     * @param no no du document, requis si le type n'est pas 'commande'
     */
    créeBon(no?: number): CLFDoc {
        let bon: CLFDoc;
        let apiDoc: ApiDoc;
        if (this.type === 'commande') {
            // l'utilisateur est le client
            // le ApiDocs ne contient que la dernière commande du client
            if (this.apiDocs.length === 0) {
                // le client n'a jamais commandé
                // on crée un ApiDoc sans lignes
                apiDoc = new ApiDoc();
                apiDoc.id = this.client.id;
            } else {
                apiDoc = this.apiDocs[0];
            }
            bon = CLFDoc.avecLignes(this, 'commande', apiDoc);
        } else {
            // l'utilisateur est le fournisseur
            apiDoc = this.apiDocs.find(ad => ad.no === no);
            if (!apiDoc) {
                // le fournisseur veut créer un bon virtuel et il n'a pas de synthèse modèle
                apiDoc = new ApiDoc();
                apiDoc.id = this.client.id;
                apiDoc.no = 0;
            }
            //            apiDoc.lignes.forEach(l => l.quantité = l.aFixer);
            bon = CLFDoc.avecLignesDansSynthèse(this, apiDoc);
        }
        if (apiDoc.lignes) {
            bon.créeLignes();
        }
        return bon;
    }

    /**
     * L'utilisateur est le client ou le fournisseur.
     * Le CLFDocs contient les ApiDoc avec type dans .apiDocs.
     * @returns la liste de CLFDoc avec key, type et apiDoc
     */
    créeRésumés(): CLFDoc[] {
        return this.apiDocs.map((apiDoc: ApiDoc) => {
            const type: TypeCLF = typeCLF(apiDoc.type);
            return CLFDoc.nouveau(this, type, apiDoc);
        });
    }

    /**
     * L'utilisateur est le client ou le fournisseur.
     * Le CLFDocs contient l'ApiData dans .apiDocuments[0]
     */
    créeVue(typeDoc: TypeCLF): CLFDoc {
        const clfDoc = CLFDoc.avecLignes(this, typeDoc, this.apiDocs[0]);
        return clfDoc;
    }

    créeDocumentsClients(): CLFDocs[] {
        const clfDocsClient = this.clients.map(client => {
            const clfDocs = new CLFDocs();
            clfDocs.type = this.typeASynthétiser;
            clfDocs.client = client;
            clfDocs.apiDocs = this.apiDocs.filter(d => d.id === client.id);
            return clfDocs;
        });
        return clfDocsClient;
    }

    /**
     * Retourne le produit lu dans le catalogue
     * @param id Id du produiit
     */
    produit(id: string): Produit {
        if (id) {
            const produit: Produit = this.catalogue.produits.find(p => p.id === +id);
            if (produit) {
                produit.nomCategorie = this.catalogue.catégories.find(c => produit.categorieId === c.id).nom;
                return produit;
            }
        }
    }

    /**
     * Ajoute ou remplace l'apiLigne ayant le no du produit de la ligne dans l'apiDoc du bon.
     * Les lignes d'un bon ont toutes la même date Date_Nulle, leur no2 (no de produit) suffit à les distinguer.
     * @param ligne ligne d'un bon
     */
    quandLigneEditée(ligne: CLFLigne) {
        const apiDocument = this.type === 'commande'
            ? this.apiDocs[0]
            : this.apiDocs.find(d => d.no === 0);
        const index = apiDocument.lignes.findIndex(l => l.id === ligne.produitId);
        if (index === -1) {
            apiDocument.lignes.push(ligne.apiLigne);
        } else {
            apiDocument.lignes[index] = ligne.apiLigne;
        }
    }

    /**
     * Met à jour l'apiDoc correspondant au CLFDoc de la ligne en supprimant l'apiLigne ayant l'index passé en paramétre.
     * @param index index d'une CLFLigne d'un bon de commande du client ou d'un bon virtuel du fournisseur dont l'enregistrement a été supprimé de la bdd.
     * Cet index est le même dans toutes les listes où un élément correspond à la ligne.
     */
    quandLigneSupprimée(index: number) {
        const apiDocument = this.type === 'commande'
            ? this.apiDocs[0]
            : this.apiDocs.find(d => d.no === 0);
        apiDocument.lignes.splice(index, 1);
    }

    /**
     * Met à jour l'ApiData de la ligne et l'ApiLigne correspondant à la ligne dans les ApiDocs du CLFDocs.
     * @param ligne CFLigne (d'un bon d'une synthèse) éditée dont l'enregistrement dans la bdd a été modifié en fixant aFixer avec la valeur du kfAFixer édité
     */
    quandAFixerFixé(ligne: CLFLigne) {
        const àFixer = ligne.éditeur.kfAFixer.valeur;
        ligne.apiLigne.aFixer = àFixer;
        const apiDocument = this.apiDocs.find(d => d.no === ligne.no);
        const apiLigne = apiDocument.lignes.find(l => l.id === ligne.produitId && l.date === ligne.date);
        apiLigne.aFixer = àFixer;
    }

    /**
     * Met à jour l'ApiData et le kfAFixer de la ligne et l'ApiLigne correspondant à la ligne dans les ApiDocs du CLFDocs.
     * @param ligne CFLigne éditée (d'un bon d'une synthèse) dont l'enregistrement dans la bdd a été modifié en copiant Quantité dans aFixer
     */
    quandQuantitéCopiéeDansAFixerLigne(ligne: CLFLigne) {
        const apiDocument = this.apiDocs.find(d => d.no === ligne.no);
        const apiLigne = apiDocument.lignes.find(l => l.id === ligne.produitId && l.date === ligne.date);
        const àFixer = apiLigne.quantité;
        ligne.aFixer = àFixer;
        apiLigne.aFixer = àFixer;
    }

    /**
     * Met à jour l'ApiData et le kfAFixer de la ligne et l'ApiLigne correspondant à la ligne dans les ApiDocs du CLFDocs.
     * @param ligne CFLigne éditée (d'un bon d'une synthèse) dont l'enregistrement dans la bdd a été modifié en annulant aFixer
     */
    quandAnnuleLigne(ligne: CLFLigne) {
        const apiDocument = this.apiDocs.find(d => d.no === ligne.no);
        const apiLigne = apiDocument.lignes.find(l => l.id === ligne.produitId && l.date === ligne.date);
        ligne.aFixer = 0;
        apiLigne.aFixer = 0;
    }

    /**
     * Met à jour les ApiData (et les kfAFixer s'ils existent) des lignes modifiées et les ApiLigne correspondant à ces lignes dans les ApiDocs du CLFDocs.
     * @param doc bon d'une synthèse dont les enregistrements des lignes dans la bdd ont été modifiés en copiant Quantité dans aFixer
     * quand c'est possible
     */
    quandQuantitéCopiéeDansAFixerDoc(doc: CLFDoc) {
        const apiDocument = this.apiDocs.find(d => d.no === doc.no);
        for (let i = 0; i < apiDocument.lignes.length; i++) {
            const ligne = doc.lignes[i];
            if (ligne.copiable) {
                const aFixer = ligne.quantité;
                ligne.aFixer = aFixer;
                apiDocument.lignes[i].aFixer = aFixer;
                doc.apiDoc.lignes[i].aFixer = aFixer;
            }
        }
    }

    quandQuantitéCopiéeDansAFixerDocs(doc: CLFDoc) {
        doc.àSynthétiser.forEach(d => this.quandQuantitéCopiéeDansAFixerDoc(d));
    }

    quandSupprimeBonVirtuel() {
        const index = this.apiDocs.findIndex(d => d.no === 0);
        this.apiDocs.splice(index, 1);
    }

    quandAnnuleDoc(doc: CLFDoc) {
        const apiDocument = this.apiDocs.find(d => d.no === doc.no);
        for (let i = 0; i < apiDocument.lignes.length; i++) {
            const ligne = doc.lignes[i];
            ligne.aFixer = 0;
            apiDocument.lignes[i] = ligne.apiLigne;
        }
    }

    quandAnnuleDocs(synthèse: CLFDoc) {
        synthèse.àSynthétiser.forEach(doc => this.quandAnnuleDoc(doc));
    }

    quandQuantitéCopiéeDansAFixerSynthèse(synthèse: CLFDoc) {
        synthèse.àSynthétiser.forEach(doc => this.quandQuantitéCopiéeDansAFixerDoc(doc));
    }

    /**
     * Met à jour this.apiDocs après qu'un nouveau bon de commande ou un nouveau bon virtuel a été créé.
     * @param créé retour de Post ne contient que le no du bon créé
     */
    quandBonCréé(créé: ApiDoc, copie?: boolean) {
        const apiDoc = new ApiDoc();
        apiDoc.id = this.client.id;
        apiDoc.no = créé.no;
        apiDoc.lignes = [];
        if (this.type === 'commande') {
            // L'utilisateur est le client.
            // Les documents sont réduits à la dernière commande du client.
            this.apiDocs = [apiDoc];
        } else {
            // L'utilisateur est le fournisseur.
            // On cherche s'il y a un modèle de bon virtuel dans les apiDocs.
            const i = this.apiDocs.findIndex(d => d.no === 0);
            if (i !== -1) {
                // On remplace le modèle de bon virtuel
                this.apiDocs[i] = apiDoc;
            } else {
                // On ajoute le bon virtuel au début des apiDocs
                this.apiDocs.unshift(apiDoc);
            }
        }
    }

    /**
     * Met à jour les documents après qu'un nouveau bon de commande ou un nouveau bon virtuel a été créé en copiant un modèle.
     * @param cloné retour de Post contient uniquement le no
     * @param copie présent et vrai si copie
     */
    quandBonCloné(cloné: ApiDoc) {
        // il faut transformer le modèle en bon en effaçant sa date et fixer son no si c'est une commande
        // et effacer son noGroupe si c'est le bon virtuel
        let modèle: ApiDoc;
        if (this.type === 'commande') {
            modèle = this.apiDocs[0];
            modèle.no = cloné.no;
        } else {
            modèle = this.apiDocs.find(d => d.no === 0);
            // le modèle de bon virtuel a pour noGroupe le no de la synthèse qu'il reprend
            modèle.noGroupe = undefined;
        }
        modèle.date = undefined;
    }

    /**
     * Si l'utilisateur a créé la commande, supprime la commande et toutes ses lignes.
     * Si l'utilisateur est le fournisseur et la commande a été créée par le client, fixe à 0 le aLivrer de toutes les lignes.
     * @param ikeyCommande tout objet ayant l'id et le no de la commande
     */
    quandSupprimeOuRefuse(ikeyCommande: IKeyIdNo) {
        if (this.type === 'commande') {
            // L'utilisateur est le client.
            // Les apiDocuments sont réduits à la dernière commande du client.
            this.apiDocs = [];
        } else {
            // L'utilisateur est le fournisseur.
            const index = this.apiDocs.findIndex(d => d.no === ikeyCommande.no);
            const commande = this.apiDocs[index];
            if (ikeyCommande.no === 0) {
                // le fournisseur a créé la commande, c'est une suppression
                this.apiDocs.splice(index, 1);
            } else {
                // le client a créé la commande, c'est un refus
                commande.lignes.forEach(l => l.aFixer = 0);
            }
        }
    }

    filtreASynthétiser(synthèse: CLFDoc) {
        const àSynthétiser = synthèse.àSynthétiser.filter(doc => !!doc.synthèse);
        this.apiDocs.filter(apiDoc => àSynthétiser.find(doc => doc.no === apiDoc.no));
    }
}
