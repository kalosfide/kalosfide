import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Compare } from '../../commun/outils/tri';
import { TypeMesureFabrique } from '../type-mesure';
import { CLFLigne } from './c-l-f-ligne';
import { CoûtDef, LigneDocumentCoût } from './cout';
import { CLFDoc } from './c-l-f-doc';
import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { CLFDocs } from './c-l-f-docs';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';

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
            créeContenu: (ligne: CLFLigne) => ligne.nomCategorie,
            compare: Compare.enchaine(
                Compare.texte((ligne: CLFLigne) => ligne.nomCategorie),
                Compare.texte((ligne: CLFLigne) => ligne.nomProduit),
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
        const créeContenu = (ligne: CLFLigne) => TypeMesureFabrique.texteSeCommande(ligne.produit.typeMesure, ligne.produit.typeCommande);
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
            afficherSi: this.utile.conditionTable.edition
        };
    }

    typeMesure(titre: string): IKfVueTableColonneDef<CLFLigne> {
        const créeContenu = (ligne: CLFLigne) => TypeMesureFabrique.texteUnités(ligne.produit.typeMesure, ligne.produit.typeCommande);
        return {
            nom: 'typeMesure',
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: titre },
            afficherSi: this.utile.conditionTable.edition
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
            classesTd: ['prix'],
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
            créeContenu: () => Fabrique.étiquetteLien(Fabrique.contenu.choisit()),
        };
    }

    supprime(
        quandLigneSupprimée: (stock: CLFDocs, index: number) => void,
    ): IKfVueTableColonneDef<CLFLigne> {
        return {
            nom: 'supprime',
            créeContenu: (ligne: CLFLigne) => {
                const bouton = this.utile.bouton.supprime(ligne, quandLigneSupprimée);
                bouton.inactivitéFnc = () => ligne.client && ligne.parent.crééParLeClient && ligne.annulé;
                return bouton;
            },
            afficherSi: this.utile.conditionTable.edition
        };
    }

    copie(clfDoc: CLFDoc): IKfVueTableColonneDef<CLFLigne> {
        const entête = this.utile.bouton.copieDoc(clfDoc);
        if (clfDoc.no === 0) {
            entête.inactivité = true;
        } else {
            entête.inactivitéIO = ValeurEtObservable.transforme(
                this.utile.service.clfBilanIO,
                () => !clfDoc.lignes || clfDoc.nbCopiables === 0
            );
        }
        return {
            nom: 'copie',
            enTeteDef: {
                titreDef: entête,
                classesTh: [KfBootstrap.classeTexte({ alignement: 'center' })],
            },
            créeContenu: (ligne: CLFLigne) => {
                const bouton = this.utile.bouton.copieLigne(ligne);
                if (clfDoc.no === 0) {
                    bouton.inactivité = true;
                } else {
                    bouton.inactivitéIO = ValeurEtObservable.transforme(
                        this.utile.service.clfBilanIO,
                        () => !ligne.copiable
                    );
                }
                return bouton;
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
    }

    annuleOuSupprime(clfDoc: CLFDoc, quandLigneSupprimée: (stock: CLFDocs, index: number) => void): IKfVueTableColonneDef<CLFLigne> {
        let nom: string;
        let def: {
            enTête?: KfBouton,
            conditionInactivitéEnTête?: () => boolean,
            contenu: (ligne: CLFLigne) => KfBouton
        };
        if (clfDoc.type === 'livraison' || clfDoc.crééParLeClient) {
            nom = 'annule';
            def = {
                enTête: this.utile.bouton.annuleDoc(clfDoc),
                conditionInactivitéEnTête: () => !clfDoc.lignes,
                contenu: (ligne: CLFLigne) => {
                    const bouton = this.utile.bouton.annuleLigne(ligne);
                    return bouton;
                }
            };
        } else {
            nom = 'supprime';
            def = {
                enTête: this.utile.bouton.supprimeBonVirtuel(clfDoc),
                contenu: (ligne: CLFLigne) => {
                    const bouton = this.utile.bouton.supprime(ligne, quandLigneSupprimée);
                    return bouton;
                }
            };
        }

        if (def.enTête) {
            if (def.conditionInactivitéEnTête) {
                def.enTête.inactivitéIO = ValeurEtObservable.transforme(
                    this.utile.service.clfBilanIO,
                    def.conditionInactivitéEnTête
                );
            }
            return {
                nom,
                enTeteDef: {
                    titreDef: def.enTête,
                    classesTh: [KfBootstrap.classeTexte({ alignement: 'center' })],
                },
                créeContenu: def.contenu,
                classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
                largeur: LargeurColonne.action,
            };
        }

        return {
            nom,
            créeContenu: def.contenu,
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
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
        quandLigneSupprimée: (stock: CLFDocs, index: number) => void,
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

    defsFournisseur(doc: CLFDoc, quandLigneSupprimée: (stock: CLFDocs, index: number) => void): IKfVueTableColonneDef<CLFLigne>[] {
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
            this.copie(doc),
            this.annuleOuSupprime(doc, quandLigneSupprimée),
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
