import { ApiDoc } from './api-doc';
import { CLFDocs } from './c-l-f-docs';
import { Client } from '../client/client';
import { Catalogue } from '../catalogue/catalogue';
import { CLFLigne } from './c-l-f-ligne';
import { ApiLigne } from './api-ligne';
import { CLFDocEditeur } from './c-l-f-doc-editeur';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KeyIdNo } from 'src/app/commun/data-par-key/key-id-no/key-id-no';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { apiType, typeCLF, TypeCLF } from './c-l-f-type';
import { CLFService } from './c-l-f.service';
import { CoûtDef, ICoût, LigneDocumentCoût } from './cout';
import { KfVueTableLigne } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne';
import { ApiDocumentsSynthèse } from './api-docs-synthese';
import { BootstrapType } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { Produit } from '../catalogue/produit';
import { Compare } from 'src/app/commun/outils/tri';

export class CLFDoc {

    type: TypeCLF;
    clfDocs: CLFDocs;
    apiDoc: ApiDoc;
    synthèse: CLFDoc;
    àSynthétiser: CLFDoc[];
    get client(): Client { return this.clfDocs.client; }

    /**
     * Ligne du bon dans la KfVueTable de la page Bons d'un client. N'existe que si le CLFDoc est un bon dans la page Bons d'un client.
     */
    vueTableLigne: KfVueTableLigne<CLFDoc>;

    private pEditeur: CLFDocEditeur;
    private pCaseToutSélectionner: KfCaseACocher;

    protected pLignes: CLFLigne[];

    private pCoûtAgrégé: ICoût;

    private constructor(clfDocs: CLFDocs, type: TypeCLF) {
        this.clfDocs = clfDocs;
        this.type = type;
    }

    public static deKey(apiDoc: ApiDoc): CLFDoc {
        const clfDoc = new CLFDoc(null, typeCLF(apiDoc.type));
        clfDoc.apiDoc = apiDoc;
        return clfDoc;
    }

    public static nouveau(clfDocs: CLFDocs, type: TypeCLF, apiDoc: ApiDoc): CLFDoc {
        const clfDoc = new CLFDoc(clfDocs, type);
        clfDoc.apiDoc = apiDoc;
        return clfDoc;
    }

    public static avecLignes(clfDocs: CLFDocs, type: TypeCLF, apiDoc: ApiDoc): CLFDoc {
        const clfDoc = CLFDoc.nouveau(clfDocs, type, apiDoc);
        if (apiDoc.lignes) {
            clfDoc.créeLignes();
        }
        return clfDoc;
    }

    public static avecLignesEtSynthèse(clfDocs: CLFDocs, type: TypeCLF, apiDoc: ApiDoc, synthèse: CLFDoc): CLFDoc {
        const clfDoc = CLFDoc.avecLignes(clfDocs, type, apiDoc);
        clfDoc.synthèse = synthèse;
        return clfDoc;
    }

    public static avecLignesDansSynthèse(clfDocs: CLFDocs, apiDoc: ApiDoc): CLFDoc {
        const clfDoc = CLFDoc.avecLignes(clfDocs, clfDocs.typeASynthétiser, apiDoc);
        clfDoc.synthèse = new CLFDoc(clfDocs, clfDocs.type);
        return clfDoc;
    }

    public static synthèse(clfDocs: CLFDocs): CLFDoc {
        const synthèse: CLFDoc = new CLFDoc(clfDocs, clfDocs.type);
        synthèse.àSynthétiser = clfDocs.apiDocs
            .filter(apiDoc => apiDoc.choisi)
            .map(apiDoc => CLFDoc.avecLignesEtSynthèse(clfDocs, clfDocs.typeASynthétiser, apiDoc, synthèse));

            // date de fin de la dernière modification du catalogue
        const date = clfDocs.site.dateCatalogue;

        // s'il y a un bon virtuel dans la synthèse, il faut fixer la date de ses lignes à celle du catalogue
        const bonVirtuel = synthèse.àSynthétiser.find(b => b.no === 0);
        if (bonVirtuel) {
            bonVirtuel.pLignes.forEach(l => l.apiLigne.date = date);
        }
        const produits_lignes: {
            produit: Produit,
            lignes: CLFLigne[]
        }[] = [];
        synthèse.àSynthétiser.forEach(bon => {
            bon.pLignes.forEach(ligne => {
                let produit_lignes = produits_lignes.find(pl => pl.produit === ligne.produit)
                if (produit_lignes) {
                    produit_lignes.lignes.push(ligne);
                } else {
                    produits_lignes.push({ produit: ligne.produit, lignes: [ligne] });
                }
            });
        });
        synthèse.pLignes = produits_lignes
            .sort(Compare.texte(produit_ligne => produit_ligne.produit.nom))
            .map(produit_lignes => {
                const produit = produit_lignes.produit;
                const ligne = new CLFLigne(synthèse, produit);
                ligne.apiLigne = new ApiLigne();
                ligne.apiLigne.id = produit.id;
                let quantité = 0;
                produit_lignes.lignes.forEach(l => quantité += l.apiLigne.aFixer);
                ligne.apiLigne.quantité = quantité;
                ligne.apiLigne.date = produit.date;
                return ligne;
            });
        synthèse.apiDoc = new ApiDoc();
        synthèse.apiDoc.id = synthèse.client.id;
        synthèse.apiDoc.lignes = synthèse.pLignes.map(l => l.apiLigne);

        return synthèse;
    }

    get estVirtuel(): boolean {
        return this.no === 0;
    }

    get existe(): boolean {
        return !!this.lignes;
    }

    lignePasDansBon(no2: number): boolean {
        return this.lignes.find(l => l.produitId === no2) === undefined;
    }

    get estVide(): boolean {
        return this.pLignes.length === 0;
    }

    get estOuvert(): boolean {
        return !this.date;
    }

    get estEnvoyé(): boolean {
        return !!this.date;
    }

    get apiLignes(): ApiLigne[] {
        return this.apiDoc.lignes;
    }

    get id(): number { return this.apiDoc.id; }
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
        return this.pEditeur ? this.pEditeur.kfChoisi.valeur : this.apiDoc.choisi;
    }
    get caseToutSélectionner(): KfCaseACocher { return this.pCaseToutSélectionner; }

    créeCaseToutSélectionner(service: CLFService) {
        const caseTout = Fabrique.caseACocher('choisi_tout', undefined,
            (() => {
                service.changeChoisis(this, caseTout.valeur);
            }).bind(this)
        );
        //        Fabrique.caseACocherAspect(caseTout, true);
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
        this.pCaseToutSélectionner.gereHtml.actionSansSuiviValeur(
            () => {
                this.pCaseToutSélectionner.valeur = nb === 0 ? false : nb === nbChoisis ? true : nb === nbExclus ? false : undefined;
                this.pCaseToutSélectionner.inactivité = nb === 0;
            }
        )();
    }

    get lignes(): CLFLigne[] {
        return this.pLignes;
    }

    créeLignes() {
        this.pLignes = this.apiDoc.lignes.map(apiLigne => {
            let produit: Produit;
            if (!this.estVirtuel && this.clfDocs.tarif) {
                produit = this.clfDocs.tarif.produits.find(
                    p => p.id === apiLigne.id && p.date === apiLigne.date);
            }
            if (!produit) {
                produit = this.catalogue.produits.find(p => p.id === apiLigne.id);
            }
            const ligne = new CLFLigne(this, produit);
            ligne.apiLigne = apiLigne;
            return ligne;
        });
    }

    créeLigne(produitId: number): CLFLigne {
        const produit = this.catalogue.produits.find(p => p.id === produitId);
        if (!produit) {
            return;
        }
        const ligne = new CLFLigne(this, produit);
        ligne.apiLigne = new ApiLigne();
        ligne.apiLigne.id = produitId;
        ligne.apiLigne.date = this.clfDocs.site.dateCatalogue;
        return ligne;
    }

    supprimeLigne(no: number) {
        const index = this.pLignes.findIndex(l => l.no === no);
        if (index === -1) {
            throw new Error(`La ligne de no ${no} à supprimer n'existe pas.`);
        }
        this.pLignes = this.pLignes.splice(index);
        this.apiDoc.lignes = this.apiDoc.lignes.splice(index, 1);
    }

    produitsACommander(): CLFDoc {
        const document = new CLFDoc(this.clfDocs, null);
        const produits = this.catalogue.produits.filter(p => this.apiDoc.lignes.find(l => l.id === p.id) === undefined);
        document.pLignes = produits.map(p => new CLFLigne(this, p));
        return document;
    }

    get code(): string {
        return apiType(this.type) + '-' + KeyIdNo.texteDeKey(this);
    }

    get titreCode(): string {
        return this.type + ' ' + this.code;
    }

    /**
     * Préparé = toutes les lignes de ce document ont leur champ aFixer renseigné.
     * Le document peut être être inclus dans une synhèse..
     */
    get préparé(): boolean {
        if (this.lignes.length === 0) {
            return false;
        }
        for (const ligne of this.lignes) {
            if (!ligne.préparé) {
                return false;
            }
        }
        return true;
    }

    /**
     * Nombre des lignes  de ce document ou des documents dont ce document fait la synthèse.
     */
    get nbAPréparer(): number {
        let nb = 0;
        if (this.àSynthétiser) {
            this.àSynthétiser.forEach(d => nb += d.nbAPréparer);
        } else {
            nb = this.pLignes.length;
        }
        return nb;
    }

    /**
     * Nombre des lignes  de ce document ou des documents dont ce document fait la synthèse qui ont leur champ aFixer renseigné.
     */
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
            nb = this.pLignes.filter(l => l.copiable && !l.préparé).length;
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
        couleur?: BootstrapType
    } {
        const bilan = this.clfDocs.créeBilanBon(this.apiDoc);
        if (bilan.total === 0) {
            return {
                texte: 'vide',
                couleur: 'warning'
            };
        }
        if (bilan.total > bilan.préparés) {
            return {
                texte: 'à préparer',
                couleur: 'danger'
            };
        }
        if (bilan.total === bilan.annulés) {
            return {
                texte: 'annulé',
                couleur: 'warning'
            };
        }
        return {
            texte: 'prêt',
            couleur: 'success'
        };
    }

    /**
     * Retourne un ApiDocumentsSynthèse contenant la key du client et une liste de no de bons à synthétiser.
     * @param filtre retourne true si le no du bon doit faire partie de la liste
     */
    apiSynthèseAEnvoyer(filtre: (clfDoc: CLFDoc) => boolean): ApiDocumentsSynthèse {
        const apiDocs = new ApiDocumentsSynthèse();
        apiDocs.id = this.id;
        apiDocs.noDocs = this.àSynthétiser
            .filter(d => filtre(d))
            .map(d => d.no);
        return apiDocs;
    }

    calculeCoûtAgrégé(): ICoût {
        const coûtDef: CoûtDef<CLFLigne> = LigneDocumentCoût.aFixer();
        this.pCoûtAgrégé = coûtDef.agrége(this.pLignes);
        return this.pCoûtAgrégé;
    }

    get coûtAgrégé(): ICoût {
        if (!this.pCoûtAgrégé) {
            return this.calculeCoûtAgrégé();
        }
        return this.pCoûtAgrégé;
    }

}
