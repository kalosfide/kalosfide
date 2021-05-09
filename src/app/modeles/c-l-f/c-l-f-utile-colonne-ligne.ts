import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Compare } from '../../commun/outils/tri';
import { TypeMesure } from '../type-mesure';
import { CLFLigne } from './c-l-f-ligne';
import { CoûtDef, LigneDocumentCoût } from './cout';
import { CLFDoc } from './c-l-f-doc';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { CLFDocs } from './c-l-f-docs';

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
            nom: this.utile.nom.catégorie,
            créeContenu: (ligne: CLFLigne) => ligne.produit.nomCategorie,
            compare: Compare.enchaine(
                Compare.texte((ligne: CLFLigne) => ligne.produit.nomCategorie),
                Compare.texte((ligne: CLFLigne) => ligne.produit.nom),
            ),
            nePasAfficherTriSi: this.utile.conditionTable.aperçu,
            enTeteDef: { titreDef: 'Catégorie' },
        };
        return def;
    }

    /**
     * Affiche le nom du produit de la ligne.
     * Tri si pas modeTable aperçu.
     */
    produit(): IKfVueTableColonneDef<CLFLigne> {
        const créeContenu = (ligne: CLFLigne) => ligne.produit.nom;
        const def: IKfVueTableColonneDef<CLFLigne> = {
            nom: this.utile.nom.produit,
            créeContenu,
            compare: Compare.texte(créeContenu),
            nePasAfficherTriSi: this.utile.conditionTable.aperçu,
            enTeteDef: { titreDef: 'Produit' },
            bilanDef: {
                titreDef: 'Total',
                titreBilanDesVisibles: 'Affichés',
                texteAgrégé: (détails: CLFLigne[]) => '' + détails.length,
            }
        };
        return def;
    }

    /**
     * Affiche le texte prix du produit suivi de € et de l'unité du type de mesure
     */
    prix(): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'prix',
            créeContenu: (ligne: CLFLigne) => Fabrique.texte.euros(ligne.prix),
            compare: Compare.enchaine(
                Compare.texte((ligne: CLFLigne) => ligne.typeMesure),
                Compare.nombre((ligne: CLFLigne) => ligne.prix)
            ),
            enTeteDef: { titreDef: 'Prix' },
        };
    }

    seCommande(): IKfVueTableColonneDef<CLFLigne> {
        const créeContenu = (ligne: CLFLigne) => TypeMesure.texteSeCommande(ligne.produit.typeMesure, ligne.produit.typeCommande);
        const def: IKfVueTableColonneDef<CLFLigne> = {
            nom: 'seCommande',
            enTeteDef: { titreDef: 'Se commande' },
            créeContenu,
            compare: Compare.texte(créeContenu),
        };
        return def;
    }

    typeCommande_edite(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'typeCommande',
            créeContenu: (ligne: CLFLigne) => ligne.éditeur.kfTypeCommande ? ligne.éditeur.kfTypeCommande : ligne.éditeur.kfTypeCommandeLS,
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
            créeContenu: (ligne: CLFLigne) => Fabrique.texte.quantitéAvecUnité(ligne.produit, ligne.quantité, ligne.typeCommande),
            compare: Compare.enchaine(
                Compare.texte((ligne: CLFLigne) => ligne.typeMesure),
                Compare.nombre((ligne: CLFLigne) => ligne.quantité)
            ),
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
                return composant;
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
                        etiquette.ajouteClasse('text-danger');
                        break;
                    case '':
                        etiquette.fixeTexte('à faire');
                        break;
                    default:
                        etiquette.fixeTexte(texte);
                }
                return etiquette;
            },
            compare: Compare.texteOuNombre((ligne: CLFLigne) => {
                if (ligne.aFixer === 0) {
                    return 'refusé';
                }
                if (ligne.aFixer > 0) {
                    return ligne.aFixer;
                }
                return 'à faire';
            }),
            enTeteDef: { titreDef: titre },
        };
        aFixer.afficherSi = this.utile.conditionTable.aperçu;
        return aFixer;
    }

    aFixer_edite(titre: string): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'aFixer',
            créeContenu: (ligne: CLFLigne) => ligne.éditeur.kfAFixer,
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this.utile.conditionTable.pasEdition
        };
    }

    typeMesure(titre: string): IKfVueTableColonneDef<CLFLigne> {
        const créeContenu = (ligne: CLFLigne) => TypeMesure.texteUnités(ligne.produit.typeMesure, ligne.produit.typeCommande);
        return {
            nom: 'typeMesure',
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this.utile.conditionTable.pasEdition
        };
    }

    coût(coûtDef: CoûtDef<CLFLigne>): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'coût',
            créeContenu: (ligne: CLFLigne) => () => coûtDef.texte(ligne),
            compare: Compare.enchaine(
                Compare.nombre((ligne: CLFLigne) => coûtDef.iCoût(ligne).valeur),
                Compare.booléenDesc((ligne: CLFLigne) => coûtDef.iCoût(ligne).complet)
            ),
            classeDefs: ['prix'],
            enTeteDef: { titreDef: 'Coût' },
            bilanDef: {
                texteAgrégé: (lignes: CLFLigne[]) => coûtDef.texteAgrégé(lignes),
            }
        };
    }

    // colonnes de commande
    choisit(): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: this.utile.nom.choisit,
            créeContenu: (ligne: CLFLigne) => this.lien.choisit(ligne)
        };
    }

    supprime(
        quandLigneSupprimée: (ligne: CLFLigne) => ((stock: CLFDocs) => void),
    ): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'supprime',
            créeContenu: (ligne: CLFLigne) => {
                const bouton = this.utile.bouton.supprime(ligne, quandLigneSupprimée);
                bouton.inactivitéFnc = () => ligne.client && ligne.parent.crééParLeClient && ligne.annulé;
                return bouton;
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

    action(clfDoc: CLFDoc, quandLigneSupprimée: (ligne: CLFLigne) => ((stock: CLFDocs) => void)): IKfVueTableColonneDef<CLFLigne> {
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
                titreDef: this.btnGroupDoc(clfDoc),
                classeDefs: ['colonne-btn-group-2'],
            },
            créeContenu: (ligne: CLFLigne) => this.btnGroupLigne(ligne, boutonAnnuleOuSupprime),
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
        quandLigneSupprimée: (ligne: CLFLigne) => ((stock: CLFDocs) => void),
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
                this.supprime(quandLigneSupprimée),
            );
        }
        return defs;
    }

    defsFournisseur(doc: CLFDoc, quandLigneSupprimée: (ligne: CLFLigne) => ((stock: CLFDocs) => void)): IKfVueTableColonneDef<CLFLigne>[] {
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
        const defs: IKfVueTableColonneDef<CLFLigne>[] = [
            this.catégorie(),
            this.produit(),
            this.prix(),
            this.quantité(champ.fixé),
            this.typeMesure(champ.typeMesure),
            this.coût(LigneDocumentCoût.quantité()),
        ];
        return defs;
    }

}
