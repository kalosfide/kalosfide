import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from 'src/app/commun/outils/tri';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Compare } from '../compare';
import { TypeMesure } from '../type-mesure';
import { CLFLigne } from './c-l-f-ligne';
import { CoûtDef, LigneDocumentCoût } from './cout';
import { CLFDoc } from './c-l-f-doc';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { ApiResult } from 'src/app/commun/api-results/api-result';

export class CLFUtileColonneLigne {
    protected utile: CLFUtile;

    constructor(utile: CLFUtile) {
        this.utile = utile;
    }

    get url(): CLFUtileUrl {
        return this.utile.url;
    }

    get lien(): CLFUtileLien {
        return this.utile.lien;
    }

    /**
     * Affiche le nom de la catégorie du produit de la ligne.
     * Tri si pas modeTable aperçu.
     */
    catégorie(): IKfVueTableColonneDef<CLFLigne> {
        const def: IKfVueTableColonneDef<CLFLigne> = {
            nom: 'catégorie',
            créeContenu: (ligne: CLFLigne) => Fabrique.texte.nomCatégorie(ligne),
            enTeteDef: { titreDef: 'Catégorie' },
        };
        def.tri = new Tri('catégorie', (d1: CLFLigne, d2: CLFLigne): number => Compare.nomCatégorie(d1, d2));
        def.nePasAfficherTriSi = this.utile.conditionTable.aperçu;
        return def;
    }

    /**
     * Affiche le nom du produit de la ligne.
     * Tri si pas modeTable aperçu.
     */
    produit(): IKfVueTableColonneDef<CLFLigne> {
        const def: IKfVueTableColonneDef<CLFLigne> = {
            nom: 'produit',
            créeContenu: (ligne: CLFLigne) => Fabrique.texte.nomProduit(ligne),
            enTeteDef: { titreDef: 'Produit' },
            bilanDef: {
                titreDef: 'Total',
                titreVisiblesSeulement: 'Affichés',
                valeurDef: '',
                texteAgrégé: (détails: CLFLigne[]) => '' + détails.length,
            }
        };
        def.tri = new Tri('produit', (d1: CLFLigne, d2: CLFLigne) => Compare.nomProduit(d1, d2));
        def.nePasAfficherTriSi = this.utile.conditionTable.aperçu;
        return def;
    }

    /**
     * Affiche le texte prix du produit suivi de € et de l'unité du type de mesure
     */
    prix(): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'prix',
            créeContenu: (ligne: CLFLigne) => Fabrique.texte.avecProduit_prix(ligne),
            enTeteDef: { titreDef: 'Prix' },
        };
    }

    seCommande(): IKfVueTableColonneDef<CLFLigne> {
        const def: IKfVueTableColonneDef<CLFLigne> = {
            nom: 'seCommande',
            enTeteDef: { titreDef: 'Se commande' },
            créeContenu: (ligne: CLFLigne) => Fabrique.texte.avecProduit_seCommande(ligne)
        };
        return def;
    }

    typeCommande(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'typeCommande',
            créeContenu: (ligne: CLFLigne) => Fabrique.texte.avecProduit_unités(ligne, ligne.typeCommande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this.utile.conditionTable.edition,
        };
    }
    typeCommande_edite(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'typeCommande',
            créeContenu: (ligne: CLFLigne) => ({
                composant: ligne.éditeur.kfTypeCommande ? ligne.éditeur.kfTypeCommande : ligne.éditeur.kfTypeCommandeLS
            }),
            enTeteDef: { titreDef: titre },
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    /**
     * Affichage de la quantité avec unité
     * @param titre titre
     */
    quantité(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'quantité',
            créeContenu: (ligne: CLFLigne) => {
                return Fabrique.texte.quantitéAvecUnité(ligne.produit, ligne.quantité, ligne.typeCommande);
            },
            enTeteDef: { titreDef: titre },
        };
    }
    quantité_edite(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'quantité',
            créeContenu: (ligne: CLFLigne) => {
                let composant: KfComposant;
                if (ligne.éditeur.kfQuantité) {
                    composant = ligne.éditeur.kfQuantité;
                } else {
                    composant = ligne.éditeur.kfQuantitéLS;
                    ligne.éditeur.kfQuantitéLS.valeur = TexteOutils.nombre(ligne.quantité ? ligne.quantité : ligne.aFixer);
                }
                return {
                    composant
                };
            },
            enTeteDef: { titreDef: titre },
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    aFixer(titre: string): IKfVueTableColonneDef<CLFLigne> {
        const aFixer: IKfVueTableColonneDef<CLFLigne> = {
            nom: 'aFixer',
            créeContenu: (ligne: CLFLigne) => {
                const etiquette = new KfEtiquette('');
                const texte = TexteOutils.nombre(ligne.aFixer);
                switch (texte) {
                    case '0':
                        etiquette.fixeTexte('refusé');
                        etiquette.ajouteClasseDef('text-danger');
                        break;
                    case '':
                        etiquette.fixeTexte('à faire');
                        break;
                    default:
                        etiquette.fixeTexte(texte);
                }
                return etiquette;
            },
            enTeteDef: { titreDef: titre },
        };
        aFixer.afficherSi = this.utile.conditionTable.aperçu;
        return aFixer;
    }

    aFixer_edite(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'aFixer',
            créeContenu: (ligne: CLFLigne) => ({ composant: ligne.éditeur.kfAFixer }),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this.utile.conditionTable.pasEdition
        };
    }

    typeMesure(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'typeMesure',
            créeContenu: (ligne: CLFLigne) => TypeMesure.texteUnités(ligne.produit.typeMesure, ligne.produit.typeCommande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this.utile.conditionTable.pasEdition
        };
    }

    coût(coûtDef: CoûtDef<CLFLigne>): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'coût',
            créeContenu: (ligne: CLFLigne) => {
                return ({ texteDef: () => coûtDef.texte(ligne) });
            },
            classeDefs: ['prix'],
            enTeteDef: { titreDef: 'Coût' },
            bilanDef: {
                valeurDef: '',
                texteAgrégé: (lignes: CLFLigne[]) => coûtDef.texteAgrégé(lignes),
            }
        };
    }

    // colonnes de commande
    choisit(): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'choix',
            créeContenu: (ligne: CLFLigne) => {
                return { composant: this.lien.choisit(ligne) };
            }
        };
    }

    supprime(
        quandLigneSupprimée: (ligne: CLFLigne) => void,
        traiteErreur?: (apiResult: ApiResult) => boolean
    ): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'supprime',
            créeContenu: (ligne: CLFLigne) => {
                const bouton = this.utile.bouton.supprime(ligne, quandLigneSupprimée, traiteErreur);
                bouton.inactivitéFnc = () => ligne.client && ligne.parent.crééParLeClient && ligne.annulé;
                return { composant: bouton };
            },
            nePasAfficherSi: this.utile.conditionTable.pasEdition
        };
    }

    private btnGroupDoc(clfDoc: CLFDoc): KfBBtnGroup {
        const btnGroup = new KfBBtnGroup('action');
        let bouton: KfBBtnGroupElement;
        bouton = this.utile.bouton.copieDoc(clfDoc);
        bouton.inactivitéIO = KfInitialObservable.transforme(
            this.utile.service.clsBilanIO,
            () => !clfDoc.lignes || clfDoc.nbCopiablesPasPréparés === 0
        );
        btnGroup.ajoute(bouton);
        if (clfDoc.type === 'livraison' || clfDoc.crééParLeClient) {
            bouton = this.utile.bouton.annuleDoc(clfDoc);
            bouton.inactivitéIO = KfInitialObservable.transforme(
                this.utile.service.clsBilanIO,
                () => !clfDoc.lignes || clfDoc.lignes.filter(l => l.préparé).length > 0
            );
        } else {
            bouton = Fabrique.bouton.fauxTexteSousIcone();
        }
        btnGroup.ajoute(bouton);
        return btnGroup;
    }

    private btnGroupLigne(ligne: CLFLigne, boutonAnnuleOuSupprime: (ligne: CLFLigne) => KfBBtnGroupElement): KfBBtnGroup {
        const btnGroup = new KfBBtnGroup('action');
        let bouton: KfBBtnGroupElement;
        bouton = this.utile.bouton.copieLigne(ligne);
        bouton.inactivitéIO = KfInitialObservable.transforme(
            this.utile.service.clsBilanIO,
                () => !ligne.copiable || ligne.préparé
        );
        btnGroup.ajoute(bouton);
        bouton = boutonAnnuleOuSupprime(ligne);
        btnGroup.ajoute(bouton);
        return btnGroup;
    }

    action(clfDoc: CLFDoc, quandLigneSupprimée: (ligne: CLFLigne) => void): IKfVueTableColonneDef<CLFLigne> {
        let boutonAnnuleOuSupprime: (ligne: CLFLigne) => KfBBtnGroupElement;
        if (clfDoc.type === 'livraison' || clfDoc.crééParLeClient) {
            boutonAnnuleOuSupprime = (ligne: CLFLigne) => {
                const bouton = this.utile.bouton.annuleLigne(ligne);
                bouton.inactivitéIO = KfInitialObservable.transforme(
                    this.utile.service.clsBilanIO,
                    () => ligne.préparé
                );
                return bouton;
            };
        } else {
            boutonAnnuleOuSupprime = (ligne: CLFLigne) => {
                const bouton = this.utile.bouton.supprime(ligne, quandLigneSupprimée);
                return bouton;
            };
        }
        return {
            nom: 'action',
            enTeteDef: {
                titreDef: { composant: this.btnGroupDoc(clfDoc) },
                classeDefs: ['colonne-btn-group-2'],
            },
            créeContenu: (ligne: CLFLigne) => {
                return { composant: this.btnGroupLigne(ligne, boutonAnnuleOuSupprime) };
            },
            classeDefs: ['colonne-btn-group-2'],
            nePasAfficherSi: this.utile.conditionTable.pasEdition,
        };
    }

    defsChoixProduit(): IKfVueTableColonneDef<CLFLigne>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.prix(),
            this.seCommande(),
            this.choisit(),
        ];
    }

    defsClient(
        quandLigneSupprimée: (ligne: CLFLigne) => void,
        traiteErreur: (apiResult: ApiResult) => boolean
    ): IKfVueTableColonneDef<CLFLigne>[] {
        const champ = this.utile.texte.commande.champ;
        const defs: IKfVueTableColonneDef<CLFLigne>[] = [
            this.catégorie(),
            this.produit(),
            this.prix(),
        ];
        if (this.utile.conditionTable.edition.valeur) {
            defs.push(
                this.quantité_edite(champ.aFixer),
                this.typeCommande_edite(champ.typeCommande),
            );
        } else {
            defs.push(this.quantité(champ.fixé));
        }
        defs.push(this.coût(LigneDocumentCoût.quantité()));
        if (this.utile.conditionTable.edition.valeur) {
            defs.push(
                this.supprime(quandLigneSupprimée, traiteErreur),
            );
        }
        return defs;
    }

    defsFournisseur(doc: CLFDoc, quandLigneSupprimée: (ligne: CLFLigne) => void): IKfVueTableColonneDef<CLFLigne>[] {
        const champ = this.utile.texte.textes(doc.clfDocs.type).champ;
        const defs: IKfVueTableColonneDef<CLFLigne>[] = [];
        defs.push(
            this.catégorie(),
            this.produit(),
            this.prix(),
        );
        if (doc.no !== 0) {
            defs.push(this.quantité(champ.source));
        }
        defs.push(
            this.aFixer_edite(champ.aFixer),
            this.aFixer(champ.fixé),
            this.typeMesure(champ.typeMesure),
            this.coût(LigneDocumentCoût.aFixer()),
            this.action(doc, quandLigneSupprimée),
        );
        return defs;
    }

    defsDocument(doc: CLFDoc): IKfVueTableColonneDef<CLFLigne>[] {
        const champ = this.utile.texte.textes(doc.type).champ;
        const coûtDef = LigneDocumentCoût.quantité();
        const defs: IKfVueTableColonneDef<CLFLigne>[] = [
            this.catégorie(),
            this.produit(),
            this.prix(),
            this.quantité(champ.fixé),
            this.typeMesure(champ.typeMesure),
            this.coût(coûtDef),
        ];
        return defs;
    }

}
