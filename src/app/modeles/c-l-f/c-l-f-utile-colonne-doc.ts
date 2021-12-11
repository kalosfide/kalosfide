import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CLFDoc } from './c-l-f-doc';
import { Compare } from '../../commun/outils/tri';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';
import { KfVueTableCellule } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-cellule';

export class CLFUtileColonneDocCLF {
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

    client(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (docsClient: CLFDoc) => docsClient.client.nom;
        return {
            nom: this.utile.nom.client,
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: 'Client' },
        };
    }

    date(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'date',
            créeContenu: (clfDoc: CLFDoc) => clfDoc.no === 0 ? '' : TexteOutils.date.en_chiffres(clfDoc.date),
            compare: Compare.date((clfDoc: CLFDoc) => clfDoc.date),
            classesTd: ['date'],
            enTeteDef: { titreDef: 'Date' },
        };
    }

    no(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'no',
            créeContenu: (clfDoc: CLFDoc) => `${clfDoc.no === 0 ? 'virtuel' : clfDoc.no}`,
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.no),
            enTeteDef: { titreDef: 'No' },
        };
    }

    préparés(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (doc: CLFDoc) => `${doc.nbPréparés} / ${doc.nbAPréparer}`;
        return {
            nom: 'préparés',
            créeContenu,
            quandItemModifié: 'rafraichit',
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.nbPréparés),
            enTeteDef: { titreDef: 'préparées', chapeauDef: 'Lignes', longueurChapeau: 2 },
        };
    }

    annulés(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (doc: CLFDoc) => `${doc.nbAnnulés} / ${doc.nbAPréparer}`;
        return {
            nom: 'annulés',
            créeContenu,
            quandItemModifié: 'rafraichit',
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.nbAnnulés),
            enTeteDef: { titreDef: 'annulées' },
        };
    }

    lignes(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'lignes',
            créeContenu: (clfDoc: CLFDoc) => '' + clfDoc.apiDoc.nbLignes,
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.apiDoc.nbLignes),
            enTeteDef: { titreDef: 'Nombre de lignes' },
        };
    }


    total(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'total',
            créeContenu: (clfDoc: CLFDoc) => Fabrique.texte.euros(clfDoc.apiDoc.total),
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.apiDoc.total),
            enTeteDef: { titreDef: 'Montant' },
        };
    }

    montant(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (clfDoc: CLFDoc) => Fabrique.texte.euros(clfDoc.calculeCoûtAgrégé());
        return {
            nom: 'montant',
            créeContenu,
            quandItemModifié: 'rafraichit',
            compare: Compare.enchaine(
                Compare.nombre((clfDoc: CLFDoc) => clfDoc.coûtAgrégé.valeur),
                Compare.booléenDesc((clfDoc: CLFDoc) => clfDoc.coûtAgrégé.complet)
            ),
            enTeteDef: { titreDef: 'Montant' },
        };
    }

    édite(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'edite',
            créeContenu: (clfDoc: CLFDoc) => {
                const bouton = this.utile.lien.bon(clfDoc);
                return bouton;
            },
            classesDiv: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
    }

    copie(synthèse: CLFDoc, quandBonModifié: (bon: CLFDoc) => void, quandBonsModifiés: () => void): IKfVueTableColonneDef<CLFDoc> {
        const entête = this.utile.bouton.copieDocs(synthèse, quandBonsModifiés);
        entête.inactivité = synthèse.àSynthétiser.filter(doc => doc.no !== 0).length === 0;
        return {
            nom: 'copie',
            enTeteDef: {
                titreDef: entête,
                classesDiv: [KfBootstrap.classeTexte({ alignement: 'center' })],
            },
            créeContenu: (clfDoc: CLFDoc) => {
                const bouton = this.utile.bouton.copieDoc(clfDoc, quandBonModifié);
                bouton.inactivité = clfDoc.estVirtuel;
                return bouton;
            },
            classesDiv: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
    }

    annuleOuSupprimeBonVirtuel(quandBonVirtuelSupprimé: () => void, quandBonModifié: (bon: CLFDoc) => void): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'annule',
            créeContenu: (clfDoc: CLFDoc) => {
                const bouton = clfDoc.estVirtuel
                    ? this.utile.bouton.supprimeBonVirtuel(clfDoc, quandBonVirtuelSupprimé)
                    : this.utile.bouton.annuleDoc(clfDoc, quandBonModifié);
                return bouton;
            },
            classesDiv: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            nePasAfficherSi: this.utile.conditionTable.aperçu
        };
    }

    état(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (clfDoc: CLFDoc) => clfDoc.préparation.texte;
        const classeOpérateur = KfBootstrap.texteColor();
        return {
            nom: 'état',
            créeContenu,
            classesTd: [(clfDoc: CLFDoc) => {
                const préparation = clfDoc.préparation;
                return classeOpérateur.classe(préparation.couleur);
            }],
            quandItemModifié: 'rafraichit',
            compare: Compare.texte(créeContenu),
            classesDiv: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            enTeteDef: {
                titreDef: 'Prêt',
                classesDiv: [KfBootstrap.classeTexte({ alignement: 'center' })],
            },
        };
    }

    sélection(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'sélection',
            enTeteDef: {
                titreDef: synthèse.caseToutSélectionner,
                chapeauDef: 'Inclure',
                longueurChapeau: 1,
                classesTh: [KfBootstrap.classeTexte({ alignement: 'center' })]
            },
            créeContenu: (bon: CLFDoc) => bon.éditeur.kfChoisi,
            quandItemModifié: (cellule: KfVueTableCellule<CLFDoc>) => {
                const clfDoc = cellule.item;
                clfDoc.éditeur.kfChoisi.inactivité = !clfDoc.préparé;
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
        };
    }

    defsBons(synthèse: CLFDoc,
        quandBonVirtuelSupprimé: () => void,
        quandBonModifié: (bon: CLFDoc) => void,
        quandBonsModifiés: () => void,
    ): IKfVueTableColonneDef<CLFDoc>[] {
        return [
            this.no(),
            this.date(),
            this.préparés(),
            this.annulés(),
            this.montant(),
            this.édite(),
            this.copie(synthèse, quandBonModifié, quandBonsModifiés),
            this.annuleOuSupprimeBonVirtuel(quandBonVirtuelSupprimé, quandBonModifié),
            this.état(),
            this.sélection(synthèse)
        ];
    }

    type(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (doc: CLFDoc) => doc.type;
        return {
            nom: 'type',
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: 'Type' },
        };
    }

    code(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (doc: CLFDoc) => doc.code;
        return {
            nom: 'code',
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: 'Code' },
        };
    }

    choisitDocument(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'choisit',
            créeContenu: () => Fabrique.étiquetteLien(Fabrique.contenu.choisit()),
        };
    }

    defsDocuments(): IKfVueTableColonneDef<CLFDoc>[] {
        return [
            this.type(),
            this.code(),
            this.date(),
            this.lignes(),
            this.total(),
            this.choisitDocument(),
        ];
    }

}
