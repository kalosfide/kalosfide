import { ApiDocument } from './api-document';
import { CLFDocs } from './c-l-f-docs';
import { Client } from '../client/client';
import { Catalogue } from '../catalogue/catalogue';
import { CLFLigne } from './c-l-f-ligne';
import { ApiLigneData } from './api-ligne';
import { CLFDocEditeur } from './c-l-f-doc-editeur';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { ApiDocumentsSynthèse } from './api-documents-client-data';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { TypeCLF } from './c-l-f-type';
import { CLFService } from './c-l-f.service';
import { CoûtDef, ICoût, LigneDocumentCoût } from './cout';
import { KfVueTableLigne } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne';

export class CLFDoc {

    type: TypeCLF;
    clfDocs: CLFDocs;
    apiDoc: ApiDocument;
    synthèse: CLFDoc;
    àSynthétiser: CLFDoc[];
    client: Client;

    /** */
    vueTableLigne: KfVueTableLigne<CLFDoc>;

    private pEditeur: CLFDocEditeur;
    private pCaseToutSélectionner: KfCaseACocher;

    private pChargeLigne: (ligne: CLFLigne, data: ApiLigneData) => void;

    protected pLignes: CLFLigne[];

    private pCoûtAgrégé: ICoût;

    constructor(clfDocs: CLFDocs, type: TypeCLF) {
        this.clfDocs = clfDocs;
        this.type = type;
    }

    get apiLignesData(): ApiLigneData[] {
        return this.apiDoc.lignes;
    }

    get uid(): string { return this.apiDoc.uid; }
    get rno(): number { return this.apiDoc.rno; }
    get no(): number { return this.apiDoc.no; }
    get date(): Date {
        if (this.apiDoc.date) {
            return new Date(this.apiDoc.date);
        }
    }

    get catalogue(): Catalogue { return this.clfDocs.catalogue; }

    /**
     * vrai si le document est une commande qui a été envoyée par le client
     */
    get crééParLeClient(): boolean {
        return this.type === 'commande' && this.date !== undefined;
    }

    créeEditeur(component: IDataComponent) {
        this.pEditeur = new CLFDocEditeur(this, component);
    }
    get éditeur(): CLFDocEditeur { return this.pEditeur; }
    get choisi(): boolean {
        return this.pEditeur ? this.pEditeur.kfChoisi.valeur : true;
    }
    get caseToutSélectionner(): KfCaseACocher { return this.pCaseToutSélectionner; }

    créeCaseACocherTout(service: CLFService) {
        const caseTout = Fabrique.caseACocher('choisi_tout', undefined,
            (() => {
                service.changeChoisis(this, caseTout.valeur);
            }).bind(this)
        );
        Fabrique.caseACocherAspect(caseTout, true);
        caseTout.estRacineV = true;
        caseTout.géreClasseEntree.ajouteClasse('text-center');
        this.pCaseToutSélectionner = caseTout;
        return caseTout;
    }

    rafraichitCaseToutSélectionner() {
        const bonsPréparés = this.àSynthétiser.filter(bon => bon.préparé);
        const nb = bonsPréparés.length;
        const nbChoisis = bonsPréparés.filter(bon => bon.choisi === true).length;
        const nbExclus = bonsPréparés.filter(bon => bon.choisi === false).length;
        this.pCaseToutSélectionner.gereHtml.actionSansSuiviValeur(() => {
            this.pCaseToutSélectionner.valeur = nb === nbChoisis ? true : nb === nbExclus ? false : undefined;
            this.pCaseToutSélectionner.inactivité = nb === 0;
        })();
    }

   private  get chargeLigne(): (ligne: CLFLigne, data: ApiLigneData) => void {
        if (!this.pChargeLigne) {
            switch (this.type) {
                case 'commande':
                    this.pChargeLigne = this.synthèse
                        ? (ligne: CLFLigne, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            if (data) {
                                ligne.apiData.typeCommande = data.typeCommande;
                                ligne.apiData.quantité = data.quantité;
                                ligne.apiData.aFixer = data.aFixer;
                                ligne.ajout = false;
                            } else {
                                ligne.ajout = true;
                            }
                        }
                        : (ligne: CLFLigne, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            if (data) {
                                ligne.apiData.typeCommande = data.typeCommande;
                                ligne.apiData.quantité = data.quantité;
                                ligne.apiData.aFixer = data.aFixer;
                                ligne.ajout = false;
                            } else {
                                ligne.ajout = true;
                            }
                        };
                    break;
                case 'livraison':
                    this.pChargeLigne = this.synthèse
                        ? (ligne: CLFLigne, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            ligne.apiData.quantité = data.quantité;
                            ligne.apiData.aFixer = data.aFixer;
                        }
                        : (ligne: CLFLigne, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            ligne.apiData.quantité = data.quantité;
                        };
                    break;
                case 'facture':
                    this.pChargeLigne = (ligne: CLFLigne, data: ApiLigneData) => {
                        ligne.apiData = new ApiLigneData();
                        ligne.apiData.no = ligne.produit.no;
                        ligne.apiData.quantité = data.quantité;
                    };
            }
        }
        return this.pChargeLigne;
    }

    get lignes(): CLFLigne[] {
        return this.pLignes;
    }

    créeLigne(no: number): CLFLigne {
        const produit = this.catalogue.produits.find(p => p.no === no);
        if (!produit) {
            return;
        }
        const ligne = new CLFLigne(this, produit);
        const apiData = this.apiDoc.lignes.find(d => d.no === no);
        this.chargeLigne(ligne, apiData);
        return ligne;
    }

    supprimeLigne(no: number) {
        const lignes = this.pLignes.filter(l => l.no !== no);
        if (lignes.length === this.pLignes.length) {
            throw new Error(`La ligne de no ${no} à supprimen n'existe pas.`);
        }
        this.pLignes = lignes;
    }

    créeLignes() {
        this.pLignes = this.apiDoc.lignes.map(d => {
            const produit = this.catalogue.produits.find(p => p.no === d.no);
            const ligne = new CLFLigne(this, produit);
            this.chargeLigne(ligne, d);
            return ligne;
        });
    }

    produitsACommander(): CLFDoc {
        const document = new CLFDoc(this.clfDocs, null);
        const produits = this.catalogue.produits.filter(p => this.apiDoc.lignes.find(l => l.no === p.no) === undefined);
        document.pLignes = produits.map(p => new CLFLigne(this, p));
        return document;
    }

    créeSynthèse() {
        const lignes: CLFLigne[] = [];
        this.àSynthétiser.forEach(d => {
            d.pLignes.forEach(l => {
                let ligne = lignes.find(l1 => l1.no2 === l.no2 && l1.prix === l.prix);
                if (ligne) {
                    ligne.apiData.quantité += l.apiData.quantité;
                } else {
                    ligne = new CLFLigne(this, l.produit);
                    this.chargeLigne(ligne, l);
                    lignes.push(ligne);
                }
            });
        });
        this.pLignes = lignes;
        this.apiDoc.lignes = lignes.map(l => l.apiData);
    }

    get code(): string {
        return this.type === 'commande' ? KeyUidRnoNo.texteDeKey(this) : '' + this.no;
    }

    get titreCode(): string {
        return this.no === 0 ? '(virtuel)' : this.clfDocs.code(this.type) + ' ' + this.code;
    }

    get no_du_date(): string {
        return `n° ${this.no} du ${TexteOutils.date.en_chiffres(this.date)}`;
    }

    /**
     * Préparé = toutes les lignes de ce document ou des documents dont ce document fait la synthèse ont leur champ aFixer renseigné.
     * Le document peut être envoyé.
     */
    get préparé(): boolean {
        if (this.àSynthétiser) {
            for (const clfDoc of this.àSynthétiser) {
                if (!clfDoc.préparé) {
                    return false;
                }
            }
        } else {
            if (this.lignes.length === 0) {
                return false;
            }
            for (const ligne of this.lignes) {
                if (!ligne.préparé) {
                    return false;
                }
            }
        }
        return true;
    }

    get nbAPréparer(): number {
        let nb = 0;
        if (this.àSynthétiser) {
            this.àSynthétiser.forEach(d => nb += d.nbAPréparer);
        } else {
            nb = this.pLignes.length;
        }
        return nb;
    }

    get nbPréparés(): number {
        let nb = 0;
        if (this.àSynthétiser) {
            this.àSynthétiser.forEach(d => nb += d.nbPréparés);
        } else {
            nb = this.pLignes.filter(l => l.préparé).length;
        }
        return nb;
    }

    get nbAnnulés(): number {
        let nb = 0;
        if (this.àSynthétiser) {
            this.àSynthétiser.forEach(d => nb += d.nbAnnulés);
        } else {
            nb = this.pLignes.filter(l => l.annulé).length;
        }
        return nb;
    }

    get nbCopiables(): number {
        let nb = 0;
        if (this.àSynthétiser) {
            this.àSynthétiser.forEach(d => nb += d.nbCopiables);
        } else {
            nb = this.pLignes.filter(l => l.copiable).length;
        }
        return nb;
    }

    get nbCopiablesPasPréparés(): number {
        let nb = 0;
        if (this.àSynthétiser) {
            this.àSynthétiser.forEach(d => nb += d.nbCopiablesPasPréparés);
        } else {
            nb = this.pLignes.filter(l => l.copiable && ! l.préparé).length;
        }
        return nb;
    }

    /**
     * Terminé = avec parent
     */
    get terminé(): boolean {
        return !!this.apiDoc.noGroupe;
    }

    get annulé(): boolean {
        for (const ligne of this.pLignes) {
            if (!ligne.annulé) {
                return false;
            }
        }
        return true;
    }

    get préparation(): {
        texte: string,
        couleur?: Couleur
    } {
        const bilan = this.clfDocs.créeBilanBon(this.apiDoc);
        if (bilan.nbAPréparer === 0) {
            return {
                texte: 'vide',
                couleur: Couleur.warning
            };
        }
        if (bilan.nbAPréparer > bilan.nbPréparés) {
            return {
                texte: '',
            };
        }
        if (bilan.nbAPréparer === bilan.nbAnnulés) {
            return {
                texte: 'annulé',
                couleur: Couleur.danger
            };
        }
        return {
            texte: 'prêt',
        };
    }

    /**
     * Retourne un ApiDocumentsSynthèse contenant la key du client et la liste des no des bons à synthétiser
     * @param filtre retourne true si le bon doit faire partie de la synthèse
     */
    apiSynthèseAEnvoyer(filtre: (clfDoc: CLFDoc) => boolean): ApiDocumentsSynthèse {
        const apiDocs = new ApiDocumentsSynthèse();
        apiDocs.keyClient = { uid: this.uid, rno: this.rno };
        apiDocs.noDocs = this.àSynthétiser
            .filter(d => filtre(d))
            .map(d => d.no);
        return apiDocs;
    }

    get coûtAgrégé(): ICoût {
        if (!this.pCoûtAgrégé) {
            const coûtDef: CoûtDef<CLFLigne> = LigneDocumentCoût.aFixer();
            this.pCoûtAgrégé = coûtDef.agrége(this.pLignes);
        }
        return this.pCoûtAgrégé;
    }

}
