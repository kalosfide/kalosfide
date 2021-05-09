import { ApiDocument } from './api-document';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Catalogue } from '../catalogue/catalogue';
import { Client } from '../client/client';
import { ApiDocumentsData, ApiDocumentsSynthèse } from './api-documents-client-data';
import { CLFLigne } from './c-l-f-ligne';
import { CLFDoc } from './c-l-f-doc';
import { Produit } from '../catalogue/produit';
import { Site } from '../site/site';
import { DATE_EST_NULLE, DATE_NULLE } from '../date-nulle';
import { IdEtatProduit } from '../catalogue/etat-produit';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { CLFBilan } from './c-l-f-bilan';
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
    keyIdentifiant: IKeyUidRno;

    /**
     * Site réduit qui peut contenir uid, rno et etat.
     * Ajouté avec uid, rno et etat quand le CLFDocs est stocké et vérifié à chaque lecture du stock pour recharger le stock si changé
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
    documents: ApiDocument[];

    /**
     * Présent quand le fournisseur est en train d'éditer le bon de livraison ou la facture d'un client pour stocker les données éditées.
     */
    private pClfBilan: CLFBilan;

    constructor() {}

    /**
     * Copie tous les champs du ClfDocs stocké par le service
     * @param stocké ClfDocs stocké par le service
     */
    copie(stocké: CLFDocs) {
        this.type = stocké.type;
        this.keyIdentifiant = stocké.keyIdentifiant;
        this.site = stocké.site;
        this.client = stocké.client;
        this.catalogue = stocké.catalogue;
        this.documents = stocké.documents;
        this.pClfBilan = stocké.clfBilan;
    }

    charge(datas: ApiDocumentsData) {
        this.site = datas.site;
        this.catalogue = datas.catalogue;
        this.client = datas.client;
        this.documents = datas.documents;
    }

    initialise(typeDoc: TypeCLF, keyIdentifiant: IKeyUidRno, site: Site) {
        this.type = typeDoc;
        this.keyIdentifiant = keyIdentifiant;
        this.site = site;
    }

    get typeASynthétiser(): TypeCLF {
        return this.type === 'livraison' ? 'commande' : this.type === 'facture' ? 'livraison' : undefined;
    }

    get keyClient(): IKeyUidRno { return this.client ? this.client : this.keyIdentifiant; }

    get apiBonVirtuel(): ApiDocument {
        const apiDoc = this.documents.find(d => d.no === 0);
        if (apiDoc) {
            if (DATE_EST_NULLE(apiDoc.date)) {
                // c'est le bon virtuel
                return apiDoc;
            } else {
                // c'est la transformation de la dernière livraison en fixant le type à 'commande' et le no à 0
            }
        }
    }

    /**
     * Un clfDocs est un contexte si son catalogue ne contient que la date
     */
    get estContexte(): boolean {
        return this.catalogue && !this.catalogue.produits;
    }

    /**
     * Fixe la valeur de la propriété qui indique si le document fera partie de la synthèse
     * @param noDoc no du document
     * @param choisi true ou false
     */
    changeChoisi(noDoc: number, choisi: boolean) {
        const apiDoc = this.documents.find(d => d.no === noDoc);
        apiDoc.choisi = choisi;
    }

    get clfBilan(): CLFBilan {
        return this.pClfBilan;
    }

    créeBilanBon(apiDoc: ApiDocument): CLFBilan {
        const bilan: CLFBilan = {
            nbAPréparer: apiDoc.lignes.length,
            nbPréparés: apiDoc.lignes.filter(l => l.aFixer !== undefined && l.aFixer !== null).length,
            nbAnnulés: apiDoc.lignes.filter(l => l.aFixer === 0).length,
        };
        return bilan;
    }

    private créeBilanASynthétiser(): CLFBilan {
        const bilan = CLFBilan.bilanVide();
        for (const apiDoc of this.documents) {
            bilan.nbAPréparer++;
            const bilanBon = this.créeBilanBon(apiDoc);
            if (bilanBon.nbAPréparer > 0 && bilanBon.nbAPréparer === bilanBon.nbPréparés) {
                bilan.nbPréparés++;
                if (apiDoc.choisi) {
                    bilan.nbSélectionnés++;
                }
            }
            if (bilanBon.nbAPréparer > 0 && bilanBon.nbAPréparer === bilanBon.nbAnnulés) {
                bilan.nbAnnulés++;
                if (apiDoc.choisi) {
                    bilan.nbAnnulésSélectionnés++;
                }
            }
        }
        this.pClfBilan = bilan;
        return bilan;
    }

    créeBilan(): CLFBilan {
        this.pClfBilan = this.type === 'commande'
            ? this.créeBilanBon(this.documents[0])
            : this.créeBilanASynthétiser();
        return this.pClfBilan;
    }

    private créeDocSansLignes(typeDoc: TypeCLF, apiDoc: ApiDocument, client: Client): CLFDoc {
        const clfDoc = new CLFDoc(this, typeDoc);
        clfDoc.apiDoc = apiDoc;
        clfDoc.type = typeDoc;
        if (clfDoc.apiDoc) {
            clfDoc.apiDoc.uid = client.uid;
            clfDoc.apiDoc.rno = client.rno;
        }
        clfDoc.client = client;
        return clfDoc;
    }

    créeDocument(): CLFDoc {
        let clfDoc: CLFDoc;
        if (!this.typeASynthétiser) {
            clfDoc = this.créeDocSansLignes('commande', this.documents[0], this.client);
            clfDoc.créeLignes();
        } else {
            clfDoc = this.créeDocSansLignes(this.type, new ApiDocument(), this.client);
            clfDoc.àSynthétiser = this.documents
                // il peut y avoir le dernier bon de livraison pour servir de modèle au bon virtuel
                .filter(apiDoc => apiDoc.type !== 'L' || this.type !== 'livraison')
                .map(apiDoc => {
                    const bon = this.créeDocSansLignes(this.typeASynthétiser, apiDoc, this.client);
                    bon.synthèse = clfDoc;
                    bon.créeLignes();
                    return bon;
                });
        }
        return clfDoc;
    }

    /**
     * Crée un CLFDoc bon correspondant à l'ApiDocument stocké.
     * @param no no du document, requis si le type n'est pas 'commande'
     */
    créeBon(no?: number): CLFDoc {
        let clfDoc: CLFDoc;
        let apiDoc: ApiDocument;
        let type: TypeCLF;
        if (this.type === 'commande') {
            type = 'commande';
            apiDoc = this.documents[0];
            if (!apiDoc) {
                apiDoc = new ApiDocument();
            }
            clfDoc = this.créeDocSansLignes(type, apiDoc, this.client);
        } else {
            type = this.type === 'livraison' ? 'commande' : this.type === 'facture' ? 'livraison' : undefined;
            apiDoc = this.documents.find(ad => ad.no === no);
            if (!apiDoc) {
                if (this.type === 'livraison' && no === 0) {
                    apiDoc = new ApiDocument();
                    apiDoc.no = no;
                    apiDoc.date = DATE_NULLE;
                } else {
                    return null;
                }
            }
            clfDoc = this.créeDocSansLignes(type, apiDoc, this.client);
            clfDoc.synthèse = new CLFDoc(this, this.type);
        }
        if (apiDoc.lignes) {
            clfDoc.créeLignes();
        }
        return clfDoc;
    }

    créeDocumentAEnvoyer(): CLFDoc {
        let document: CLFDoc;
        if (!this.typeASynthétiser) {
            document = this.créeDocSansLignes('commande', this.documents[0], this.client);
            document.créeLignes();
        } else {
            document = this.créeDocSansLignes(this.type, new ApiDocument(), this.client);
            document.àSynthétiser = this.documents.map(apiDoc => {
                const bon = this.créeDocSansLignes(this.typeASynthétiser, apiDoc, this.client);
                bon.créeLignes();
                bon.synthèse = document;
                return bon;
            });
            document.créeSynthèse();
        }
        return document;
    }

    /**
     * L'utilisateur est le client ou le fournisseur.
     * Le CLFDocs contient les ApiDocument avec type dans .apiDocuments
     */
    créeVues(): CLFDoc[] {
        return this.documents.map((apiDoc: ApiDocument) => {
            const client = this.client ? this.client : this.clients.find(c => c.uid === apiDoc.uid && c.rno === apiDoc.rno);
            const type: TypeCLF = typeCLF(apiDoc.type);
            const clfDoc = this.créeDocSansLignes(type, apiDoc, client);
            return clfDoc;
        });
    }

    /**
     * L'utilisateur est le client ou le fournisseur.
     * Le CLFDocs contient l'ApiData dans .apiDocuments[0]
     */
    créeVue(typeDoc: TypeCLF): CLFDoc {
        const clfDoc = this.créeDocSansLignes(typeDoc, this.documents[0], this.client);
        clfDoc.créeLignes();
        return clfDoc;
    }

    créeDocumentsClients(): CLFDocs[] {
        const clfDocsClient = this.clients.map(client => {
            const clfDocs = new CLFDocs();
            clfDocs.type = this.typeASynthétiser;
            clfDocs.client = client;
            clfDocs.documents = this.documents.filter(d => d.uid === client.uid && d.rno === client.rno);
            return clfDocs;
        });
        return clfDocsClient;
    }

    /**
     * Retourne le produit lu dans le catalogue
     * @param no no du produiit
     */
    produit(no: string | number): Produit {
        if (no) {
            const produit: Produit = this.catalogue.produits.find(p => p.no === +no);
            if (produit) {
                produit.nomCategorie = this.catalogue.catégories.find(c => produit.categorieNo === c.no).nom;
                return produit;
            }
        }
    }

    quandLigneEditée(ligne: CLFLigne) {
        const apiDocument = this.type === 'commande'
            ? this.documents[0]
            : this.documents.find(d => DATE_EST_NULLE(d.date));
        const index = apiDocument.lignes.findIndex(l => l.no === ligne.no2);
        if (index === -1) {
            apiDocument.lignes.push(ligne.apiLigneDataAStocker());
        } else {
            apiDocument.lignes[index] = ligne.apiLigneDataAStocker();
        }
    }

    quandLigneSupprimée(ligne: CLFLigne) {
        const apiDocument = this.type === 'commande'
            ? this.documents[0]
            : this.documents.find(d => DATE_EST_NULLE(d.date));
        const index = apiDocument.lignes.findIndex(l => l.no === ligne.no2);
        apiDocument.lignes.splice(index, 1);
    }
    quandAFixerFixé(ligne: CLFLigne) {
        ligne.sauveAFixer();
        const apiDocument = this.documents.find(d => d.no === ligne.no);
        const index = apiDocument.lignes.findIndex(l => l.no === ligne.no2);
        apiDocument.lignes[index].aFixer = ligne.aFixer;
    }

    quandSourceCopiéeDansAFixer1(ligne: CLFLigne) {
        const apiDocument = this.documents.find(d => d.no === ligne.no);
        const index = apiDocument.lignes.findIndex(l => l.no === ligne.no2);
        ligne.aFixer = ligne.quantité;
        apiDocument.lignes[index] = ligne.apiLigneDataAStocker();
    }

    quandSourceCopiéeDansAFixerDoc(doc: CLFDoc) {
        const apiDocument = this.documents.find(d => d.no === doc.no);
        for (let i = 0; i < apiDocument.lignes.length; i++) {
            const ligne = doc.lignes[i];
            if (ligne.copiable) {
                ligne.aFixer = ligne.quantité;
                apiDocument.lignes[i] = ligne.apiLigneDataAStocker();
            }
        }
    }

    quandSourceCopiéeDansAFixerDocs(doc: CLFDoc) {
        doc.àSynthétiser.forEach(d => this.quandSourceCopiéeDansAFixerDoc(d));
    }

    quandAnnule1(ligne: CLFLigne) {
        const apiDocument = this.documents.find(d => d.no === ligne.no);
        const index = apiDocument.lignes.findIndex(l => l.no === ligne.no2);
        ligne.aFixer = 0;
        apiDocument.lignes[index] = ligne.apiLigneDataAStocker();
    }

    quandAnnuleDoc(doc: CLFDoc) {
        const apiDocument = this.documents.find(d => d.no === doc.no);
        for (let i = 0; i < apiDocument.lignes.length; i++) {
            const ligne = doc.lignes[i];
            ligne.aFixer = 0;
            apiDocument.lignes[i] = ligne.apiLigneDataAStocker();
        }
    }

    quandAnnuleDocs(synthèse: CLFDoc) {
        synthèse.àSynthétiser.forEach(doc => this.quandAnnuleDoc(doc));
    }

    quandSourceCopiéeDansAFixerSynthèse(synthèse: CLFDoc) {
        synthèse.àSynthétiser.forEach(doc => this.quandSourceCopiéeDansAFixerDoc(doc));
    }

    /**
     * Met à jour les documents après qu'une nouvelle commande a été créée.
     * @param créé retour de Post
     * @param copie présent et vrai si copie
     */
    quandCommandeCréée(créé: ApiDocument, copie?: boolean) {
        let apiDoc: ApiDocument;
        if (copie) {
            if (this.type === 'commande') {
                apiDoc = this.documents[0];
                apiDoc.no = créé.no;
                apiDoc.date = undefined;
            } else {
                apiDoc = this.documents.find(d => d.no === 0);
                // àCopier est une commande virtuelle créée à partir de la dernière livraison
                // àCopier.date est la date de  la dernière livraison
                // Pour en faire un bon de commande virtuel actif, il suffit d'annuler sa date
                apiDoc.date = DATE_NULLE;
                apiDoc.lignes = apiDoc.lignes
                    .filter(l => {
                        const produit = this.produit(l.no);
                        return produit && produit.etat === IdEtatProduit.disponible;
                    });
            }
        } else {
            apiDoc = new ApiDocument();
            apiDoc.no = créé.no;
            apiDoc.lignes = [];
            let keyClient: IKeyUidRno;
            if (this.type === 'livraison') {
                // L'utilisateur est le fournisseur.
                keyClient = this.client;
                apiDoc.date = DATE_NULLE;
                const i = this.documents.findIndex(d => d.no === 0);
                if (i === -1) {
                    this.documents.push(apiDoc);
                } else {
                    this.documents[i] = apiDoc;
                }
            } else {
                // L'utilisateur est le client.
                // Les documents sont réduits à la dernière commande du client.
                keyClient = this.keyIdentifiant;
                this.documents = [apiDoc];
            }
            apiDoc.uid = keyClient.uid;
            apiDoc.rno = keyClient.rno;
        }
        this.catalogue.prixDatés = undefined;
    }

    /**
     * Si l'utilisateur a créé la commande, supprime la commande et et toutes ses lignes.
     * Si l'utilisateur est le fournisseur et la commande a été créée par le client, fixe à 0 le aLivrer de toutes les lignes.
     * @param ikeyCommande tout objet ayant l'uid, le rno et le no de la commande
     */
    quandSupprimeOuRefuse(ikeyCommande: IKeyUidRnoNo) {
        if (this.type === 'commande') {
            // L'utilisateur est le client.
            // Les apiDocuments sont réduits à la dernière commande du client.
            this.documents = [];
        } else {
            // L'utilisateur est le fournisseur.
            const index = this.documents.findIndex(d => d.no === ikeyCommande.no);
            const commande = this.documents[index];
            if (DATE_EST_NULLE(commande.date)) {
                // le fournisseur a créé la commande
                this.documents.splice(index, 1);
            } else {
                commande.lignes.forEach(l => l.aFixer = 0);
            }
        }
    }

    filtreASynthétiser(synthèse: CLFDoc) {
        const àSynthétiser = synthèse.àSynthétiser.filter(doc => !!doc.synthèse);
        this.documents.filter(apiDoc => àSynthétiser.find(doc => doc.no === apiDoc.no));
    }

    code(type: TypeCLF): string {
        return type === 'facture' ? '' : type === 'livraison' ? 'B.L.' : 'B.C.';
    }

}

